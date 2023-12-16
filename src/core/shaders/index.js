export const vertexShaderCommon = () => {
return `
varying vec2 vUv;
      
void main() {
  vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`
}

export const vertexShaderFinal= () => {
  return `
  varying vec2 vUv;
        
  void main() {
    vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `
  }

export const fragmentShaderRedColor = () => { return `
precision highp float;
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
} `
}

export const fragmentShaderBlueColor = () => { return `
precision highp float;
void main() {
  gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // Red color
} `
}

export const fragmentShaderClouds = () => {
return `
uniform vec2 u_resolution;
uniform float time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st * 15.0);

    // Use the noise function
    float n = noise(pos);

    gl_FragColor = vec4(vec3(n), 1.0);
}            `
}

export const fragmentShaderfBM = () => {
return `
uniform vec2 u_resolution;

uniform float time;
varying vec2 vUv;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {

    vec2 st = vUv;
    st.x *= st.x/st.y;

    vec3 color = vec3(0.0);
    color += fbm(st*3.0 * 11.0);

    gl_FragColor = vec4(color,1.0);
}`
}



export const fragmentShaderCellularNoise = () => {
return `
uniform vec2 u_resolution;
uniform float time;

// Permutation polynomial: (34x^2 + x) mod 289
vec4 permute(vec4 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

// Cellular noise, returning F1 and F2 in a vec2.
// Speeded up by using 2x2 search window instead of 3x3,
// at the expense of some strong pattern artifacts.
// F2 is often wrong and has sharp discontinuities.
// If you need a smooth F2, use the slower 3x3 version.
// F1 is sometimes wrong, too, but OK for most purposes.
vec2 cellular2x2(vec2 P) {
	#define K 0.142857142857 // 1/7
	#define K2 0.0714285714285 // K/2
	#define jitter 0.8 // jitter 1.0 makes F1 wrong more often
	vec2 Pi = mod(floor(P), 289.0);
 	vec2 Pf = fract(P);
	vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
	vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
	vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
	p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
	vec4 ox = mod(p, 7.0)*K+K2;
	vec4 oy = mod(floor(p*K),7.0)*K+K2;
	vec4 dx = Pfx + jitter*ox;
	vec4 dy = Pfy + jitter*oy;
	vec4 d = dx * dx + dy * dy; // d11, d12, d21 and d22, squared
	// Sort out the two smallest distances
#if 0
	// Cheat and pick only F1
	d.xy = min(d.xy, d.zw);
	d.x = min(d.x, d.y);
	return d.xx; // F1 duplicated, F2 not computed
#else
	// Do it right and find both F1 and F2
	d.xy = (d.x < d.y) ? d.xy : d.yx; // Swap if smaller
	d.xz = (d.x < d.z) ? d.xz : d.zx;
	d.xw = (d.x < d.w) ? d.xw : d.wx;
	d.y = min(d.y, d.z);
	d.y = min(d.y, d.w);
	return sqrt(d.xy);
#endif
}

void main(void) {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	vec2 F = cellular2x2(st*20.0);

	float n = 1.0-1.5*F.x;
	gl_FragColor = vec4(n, n, n, 1.0);
}
`
}



export const fragmentShaderHermitieInterpolation = () => {  return `
uniform sampler2D tPrevious;
uniform sampler2D tPrevious1;
varying vec2 vUv;
uniform float time;

vec3 hermiteInterpolation(vec3 color1, vec3 color2, float t) {
  float t2 = t * t;
  float t3 = t2 * t;

  // Hermite interpolation formula
  float h1 = 2.0 * t3 - 3.0 * t2 + 1.0;
  float h2 = -2.0 * t3 + 3.0 * t2;
  float h3 = t3 - 2.0 * t2 + t;
  float h4 = t3 - t2;

  // Interpolate each component separately
  vec3 result = color1 * h1 + color2 * h2 + (color1 - color2) * h3 + (color2 - color1) * h4;

  return result;
}
void main() {
  vec4 color = texture2D(tPrevious, vUv);
  vec4 color2 = texture2D(tPrevious1, vUv);
  // vec3 newCol = mix(color, color2, time).rgb;
  vec3 newCol = hermiteInterpolation(color.rgb, color2.rgb, time);

  gl_FragColor = vec4(newCol,1.0);
}
`}

export const fragmentShaderLinearInterpolation = () => {  return `
uniform sampler2D tPrevious;
uniform sampler2D tPrevious1;
varying vec2 vUv;
uniform float time;


void main() {
  vec4 color = texture2D(tPrevious, vUv);
  vec4 color2 = texture2D(tPrevious1, vUv);
  vec3 newCol = mix(color, color2, time).rgb;
  
  gl_FragColor = vec4(newCol,1.0);
}
`}


export const fragmentShaderNoiseInterpolation = () => {  return `
uniform sampler2D tPrevious;
uniform sampler2D tPrevious1;
varying vec2 vUv;
uniform float time;

// Function to generate 1D Perlin noise
float perlinNoise(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

// Function for smooth interpolation with Perlin noise
float noiseSmoothInterpolation(float t) {
    float noise = perlinNoise(t * 10.0); // Adjust the multiplier for different noise patterns
    return t + 0.5 * (noise - 0.5);
}

// Function to interpolate between two colors using noise-based smooth interpolation
vec3 noiseSmoothInterpolation(vec3 color1, vec3 color2, float t) {
    float smoothedT = noiseSmoothInterpolation(t);
    return mix(color1, color2, smoothedT);
}

void main() {

  
  vec4 color = texture2D(tPrevious, vUv);
  vec4 color2 = texture2D(tPrevious1, vUv);

  // Perform noise-based interpolation
  vec3 interpolatedColor = noiseSmoothInterpolation(color.rgb, color2.rgb, time);

  gl_FragColor = vec4(interpolatedColor,1.0);
}
`}


export const fragmentShaderSmoothStepInterpolator = () => {
  return `
  uniform sampler2D tPrevious;
uniform sampler2D tPrevious1;
varying vec2 vUv;
uniform float time;

  vec3 smoothstepInterpolation(vec3 color1, vec3 color2, float t) {
    float smoothT = smoothstep(0.0, 1.0, t);
    return mix(color1, color2, smoothT);
  }

    void main() {

  
      vec4 color = texture2D(tPrevious, vUv);
      vec4 color2 = texture2D(tPrevious1, vUv);
    
      // Perform noise-based interpolation
      vec3 interpolatedColor = smoothstepInterpolation(color.rgb, color2.rgb, time);
    
      gl_FragColor = vec4(interpolatedColor,1.0);
    }`
}



export const fragmentShaderHermiteSplineInterpolation = () => {
  return `
  uniform sampler2D tPrevious;
  uniform sampler2D tPrevious1;
  varying vec2 vUv;
  uniform float time;

  // Hermite spline interpolation function
float hermiteInterpolation(float t) {
    return t * t * (3.0 - 2.0 * t);
}

// Function to interpolate between two colors using Hermite spline
vec3 hermiteSplineInterpolation(vec3 color1, vec3 color2, float t) {
    float smoothT = hermiteInterpolation(t);
    return mix(color1, color2, smoothT);
}


    void main() {

  
      vec4 color = texture2D(tPrevious, vUv);
      vec4 color2 = texture2D(tPrevious1, vUv);
    
      // Perform noise-based interpolation
      vec3 interpolatedColor = hermiteSplineInterpolation(color.rgb, color2.rgb, time);
    
      gl_FragColor = vec4(interpolatedColor,1.0);
    }`
}