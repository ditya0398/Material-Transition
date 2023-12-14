export const vertexShader = () => {
  return `

  vec3 mod289(vec3 x)
  {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
   return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
   return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
   return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise
  float cnoise(vec3 P)
  {
   vec3 Pi0 = floor(P); // Integer part for indexing
   vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
   Pi0 = mod289(Pi0);
   Pi1 = mod289(Pi1);
   vec3 Pf0 = fract(P); // Fractional part for interpolation
   vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
   vec4 iy = vec4(Pi0.yy, Pi1.yy);
   vec4 iz0 = Pi0.zzzz;
   vec4 iz1 = Pi1.zzzz;

   vec4 ixy = permute(permute(ix) + iy);
   vec4 ixy0 = permute(ixy + iz0);
   vec4 ixy1 = permute(ixy + iz1);

   vec4 gx0 = ixy0 * (1.0 / 7.0);
   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
   gx0 = fract(gx0);
   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
   vec4 sz0 = step(gz0, vec4(0.0));
   gx0 -= sz0 * (step(0.0, gx0) - 0.5);
   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

   vec4 gx1 = ixy1 * (1.0 / 7.0);
   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
   gx1 = fract(gx1);
   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
   vec4 sz1 = step(gz1, vec4(0.0));
   gx1 -= sz1 * (step(0.0, gx1) - 0.5);
   gy1 -= sz1 * (step(0.0, gy1) - 0.5);

   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
   g000 *= norm0.x;
   g010 *= norm0.y;
   g100 *= norm0.z;
   g110 *= norm0.w;
   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
   g001 *= norm1.x;
   g011 *= norm1.y;
   g101 *= norm1.z;
   g111 *= norm1.w;

   float n000 = dot(g000, Pf0);
   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
   float n111 = dot(g111, Pf1);

   vec3 fade_xyz = fade(Pf0);
   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
   return 2.2 * n_xyz;
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
   vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
   vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
   Pi0 = mod289(Pi0);
   Pi1 = mod289(Pi1);
   vec3 Pf0 = fract(P); // Fractional part for interpolation
   vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
   vec4 iy = vec4(Pi0.yy, Pi1.yy);
   vec4 iz0 = Pi0.zzzz;
   vec4 iz1 = Pi1.zzzz;

   vec4 ixy = permute(permute(ix) + iy);
   vec4 ixy0 = permute(ixy + iz0);
   vec4 ixy1 = permute(ixy + iz1);

   vec4 gx0 = ixy0 * (1.0 / 7.0);
   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
   gx0 = fract(gx0);
   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
   vec4 sz0 = step(gz0, vec4(0.0));
   gx0 -= sz0 * (step(0.0, gx0) - 0.5);
   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

   vec4 gx1 = ixy1 * (1.0 / 7.0);
   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
   gx1 = fract(gx1);
   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
   vec4 sz1 = step(gz1, vec4(0.0));
   gx1 -= sz1 * (step(0.0, gx1) - 0.5);
   gy1 -= sz1 * (step(0.0, gy1) - 0.5);

   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
   g000 *= norm0.x;
   g010 *= norm0.y;
   g100 *= norm0.z;
   g110 *= norm0.w;
   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
   g001 *= norm1.x;
   g011 *= norm1.y;
   g101 *= norm1.z;
   g111 *= norm1.w;

   float n000 = dot(g000, Pf0);
   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
   float n111 = dot(g111, Pf1);

   vec3 fade_xyz = fade(Pf0);
   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
   return 1.5 * n_xyz;
  }

  varying vec2 vUv;
  varying float noise;
  varying float qnoise;
  varying float displacement;

  uniform float time;
 

  float turbulence( vec3 p) {
   float t = - 0.1;
   for (float f = 1.0 ; f <= 3.0 ; f++ ){
     float power = pow( 2.0, f );
     t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
   }
   return t;
  }

  void main() {
    float pointscale = 1.0;
    float decay = 1.0; 
    float complex = 0.3;
    float waves = 3.5;
    float eqcolor = 7.0;
    bool fragment = true;
   vUv = uv;

   noise = (1.0 *  - waves) * turbulence( decay * abs(normal + time));
   qnoise = (2.0 *  - eqcolor) * turbulence( decay * abs(normal + time));
   float b = pnoise( complex * (position) + vec3( 1.0 * time ), vec3( 100.0 ) );

   if (fragment == true) {
     displacement = - sin(noise) + normalize(b * 0.5);
   } else {
     displacement = - sin(noise) + cos(b * 0.5);
   }

   vec3 newPosition = (position) + (normal * displacement);
   gl_Position = (projectionMatrix * modelViewMatrix) * vec4( newPosition, 1.0 );
   gl_PointSize = (pointscale);

  }
  `;
};

export const fragmentShader = () => {
  return `

  varying float qnoise;
  uniform float time;
  
  void main() {
    float r, g, b;
    bool redhell = false;

    if (!redhell == true) {
      r = cos(qnoise + 0.5);
      g = cos(qnoise - 0.5);
      b = 0.0;
    } else {
      r = cos(qnoise + 0.5);
      g = cos(qnoise - 0.5);
      b = abs(qnoise);
    }
    gl_FragColor = vec4(66., 157., 105., 255.0) / 255.;
  }
  `;
};

export const vertexShaderLava = () => {
  return `
varying vec2 vUv;
varying float noise;
uniform float time;
  
  vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}

void main() {

    vUv = uv;

    // add time to the noise parameters so it's animated
    noise = 10.0 *  -.10 * turbulence( .5 * normal + time );
    float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
    float displacement = - noise + b;
    
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
`
}

export const fragmentShaderLava = () => {
  return `
varying vec2 vUv;
varying float noise;

void main() {

    // compose the colour using the UV coordinate
    // and modulate it with the noise like ambient occlusion
    vec3 color = vec3( vUv * 2.0 * ( 1.0 - 2. * noise ), 0.4 );
    gl_FragColor = vec4( color.rgb, 1.0 );

}
`
}

export const vertexShaderCommon = () => {
return `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
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
    float n = noise(pos * time);

    gl_FragColor = vec4(vec3(n), 1.0);
}            `
}

export const fragmentShaderfBM = () => {
return `
uniform vec2 u_resolution;

uniform float time;

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

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    color += fbm(st*3.0 * time);

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
    pos.y -= time * 0.3125;
    
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

	vec2 F = cellular2x2(st*20.+vec2(time,0.));

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