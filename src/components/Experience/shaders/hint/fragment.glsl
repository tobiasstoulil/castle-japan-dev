uniform sampler2D uNoiseTexture;
uniform sampler2D uHintAlpha;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    vec3 toFragment = normalize(cameraPosition - vWorldPosition);

    vec3 initialCameraPosition = vec3(30.6086, 38., 30.6086);
    vec3 forward = normalize(initialCameraPosition);

    float facing = dot(toFragment, forward);
    facing = pow(facing, 500.);  

    float noise = texture2D(uNoiseTexture, vUv * 5.).x;
    noise = pow(noise, 10.);
    noise = noise * 500.;
    
    float circle = smoothstep(-1., 0.125, facing);

    noise *= (1. - circle);
    facing = smoothstep(0., 0.0025 + noise, facing);
    // facing = pow(facing, 1.);

    facing = clamp(facing, 0., 1.);

    float hintAlpha = texture2D(uHintAlpha, vUv).r;
    hintAlpha = pow(hintAlpha, 0.425);

    float finalCol = mix(0.5, 0.275, hintAlpha);

    gl_FragColor = vec4(vec3(finalCol * 2.075), hintAlpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}