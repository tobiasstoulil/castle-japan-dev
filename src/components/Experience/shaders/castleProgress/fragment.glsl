uniform sampler2D uNeutralTexture;
uniform sampler2D uNoiseTexture;
uniform float uProgress;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{


    vec3 neutralCol = texture2D(uNeutralTexture, vUv).rgb;
    neutralCol *= 1.1;

    float noise = texture2D(uNoiseTexture, vUv * 3.).r;
    noise = noise * 5.;
    noise = pow(noise, 1.25);

    float progress = uProgress * 20.;
    float fac = smoothstep(0., 0. + progress * noise +  uProgress * 50., vWorldPosition.y);


    gl_FragColor = vec4(vec3(neutralCol ), fac);


    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}