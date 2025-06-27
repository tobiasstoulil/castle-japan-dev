uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

float scale = 3.;
float smoothness = 0.05;
float seed = 14000.;

// http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
float random(vec2 co)
{
    highp float a = seed;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
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

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

varying vec2 vUv;

void main()
{
    vec2 uv = vUv;

    vec3 tex1 = texture(uTexture1, uv).xyz;
    tex1 *= 0.875;
    vec3 tex2 = texture(uTexture2, uv).xyz;
    tex2 *= 0.875;


    float time = uTime * 0.1;
    float n = noise(uv * scale + time * 2.5);
  
    float p = mix(-smoothness, 1.0 + smoothness, uProgress);
    float lower = p - smoothness;
    float higher = p + smoothness;
  

    float progress = smoothstep(lower, higher, n);

    
    float finalProgress = (1.- progress );

    finalProgress = clamp(finalProgress, 0., 1.);

    vec3 finalCol = mix(tex1, tex2, finalProgress);

    gl_FragColor = vec4(vec3(finalCol), 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}