export const vertexShaderCommon = () => {
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
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    color += fbm(st*3.0 * 0.1);

    gl_FragColor = vec4(color,1.0);
}`
}

export const fragmentShaderDomainWarp = () => {
return `
uniform vec2 u_resolution;

uniform float time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

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

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    // st += st * abs(sin(time*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15* time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126* time);

    float f = fbm(st+r);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}
`
}

export const fragmentShaderFire = () => {
return `
uniform vec2 u_resolution;
uniform float time;
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float hermite(float t)
{
return t * t * (3.0 - 2.0 * t);
}

float noise(vec2 co, float frequency)
{
vec2 v = vec2(co.x * frequency, co.y * frequency);

float ix1 = floor(v.x);
float iy1 = floor(v.y);
float ix2 = floor(v.x + 1.0);
float iy2 = floor(v.y + 1.0);

float fx = hermite(fract(v.x));
float fy = hermite(fract(v.y));

float fade1 = mix(rand(vec2(ix1, iy1)), rand(vec2(ix2, iy1)), fx);
float fade2 = mix(rand(vec2(ix1, iy2)), rand(vec2(ix2, iy2)), fx);

return mix(fade1, fade2, fy);
}

float pnoise(vec2 co, float freq, int steps, float persistence)
{
float value = 0.0;
float ampl = 1.0;
float sum = 0.0;
for(int i = 0 ; i < 15 ; i++)
{
  sum += ampl;
  value += noise(co, freq) * ampl;
  freq *= 2.0;
  ampl *= persistence;
}
return value / sum;
}
void main() {
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float gradient = 1.0 - uv.y;
    float gradientStep = 0.2;
    
    vec2 pos = gl_FragCoord.xy / u_resolution.x;
    pos.y -= 0.3125;
    
    vec4 brighterColor = vec4(1.0, 0.65, 0.1, 0.25);
    vec4 darkerColor = vec4(1.0, 0.0, 0.15, 0.0625);
    vec4 middleColor = mix(brighterColor, darkerColor, 0.5);

    float noiseTexel = pnoise(pos, 10.0, 5, 0.5);
    
    float firstStep = smoothstep(0.0, noiseTexel, gradient);
    float darkerColorStep = smoothstep(0.0, noiseTexel, gradient - gradientStep);
    float darkerColorPath = firstStep - darkerColorStep;
    vec4 color = mix(brighterColor, darkerColor, darkerColorPath);

    float middleColorStep = smoothstep(0.0, noiseTexel, gradient - 0.2 * 2.0);
    
    color = mix(color, middleColor, darkerColorStep - middleColorStep);
    color = mix(vec4(0.0), color, firstStep);
    gl_FragColor = color;
}



`
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

export const fragmentShaderVornoiNoise = () => {
  return `
  uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 voronoi( in vec2 x ) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( u_time + 6.2831*o );

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j= -2; j <= 2; j++) {
        for (int i= -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( u_time + 6.2831*o );

            vec2 r = g + o - f;

            if ( dot(mr-r,mr-r)>0.00001 ) {
                md = min(md, dot( 0.5*(mr+r), normalize(r-mr) ));
            }
        }
    }
    return vec3(md, mr);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);

    // Scale
    st *= 3.;
    vec3 c = voronoi(st);

    // isolines
    color = c.x*(0.5 + 0.5*sin(64.0*c.x))*vec3(1.0);
    // borders
    color = mix( vec3(1.0), color, smoothstep( 0.01, 0.02, c.x ) );
    // feature points
    float dd = length( c.yz );
    color += vec3(1.)*(1.0-smoothstep( 0.0, 0.04, dd));

    gl_FragColor = vec4(color,1.0);
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

// Perlin noise function
float perlinNoise(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}

// Custom noise-based color interpolation function
vec3 colorNoiseInterpolator(vec3 color1, vec3 color2, float t) {
  // Use Perlin noise for smooth interpolation
  float noise = perlinNoise(t);

  // Use smoothstep function for smoother transitions
  float smoothT = smoothstep(0.0, 1.0, t);

  // Interpolate each color component separately
  vec3 result = mix(color1, color2, mix(smoothT, noise, 0.5));

  return result;
}




void main() {

  
  vec4 color = texture2D(tPrevious, vUv);
  vec4 color2 = texture2D(tPrevious1, vUv);

  // Perform noise-based interpolation
  vec3 interpolatedColor = colorNoiseInterpolator(color.rgb, color2.rgb, time);

  gl_FragColor = vec4(interpolatedColor,1.0);
}
`}


