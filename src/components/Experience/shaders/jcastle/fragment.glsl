uniform sampler2D uNeutralTexture;
uniform sampler2D uNoiseTexture;
uniform sampler2D uBakedFirstStepTexture;
uniform sampler2D uBakedSecondtStepTexture;
uniform sampler2D uBakedThirdStepTexture;

// uniform float uProgress;
uniform float uTime;
uniform float uFirstProgress;
uniform float uSecondProgress;
uniform float uThirdProgress;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    // vec3 toFragment = normalize(cameraPosition - vWorldPosition);

    // vec3 initialCameraPosition = vec3(30.6086, 38., 30.6086);
    // vec3 forward = normalize(initialCameraPosition);

    // float facing = dot(toFragment, forward);
    // facing = pow(facing, 500.);  

    // float noise = texture2D(uNoiseTexture, vUv * 5.).x;
    // noise = pow(noise, 10.);
    // noise = noise * 500.;
    
    // float circle = smoothstep(-1., 0.125, facing);

    // noise *= (1. - circle);
    // facing = smoothstep(0., 0.0025 + noise, facing);
    // // facing = pow(facing, 1.);

    // facing = clamp(facing, 0., 1.);

    
    // if(facing == 1.){
    //     discard;
    // }


    vec3 neutralCol = texture2D(uNeutralTexture, vUv).rgb;
    neutralCol *= 1.125;

    vec3 firstStepCol = texture2D(uBakedFirstStepTexture, vUv).rgb;
    // firstStepCol *= 1.125;

    vec3 secondStepCol = texture2D(uBakedSecondtStepTexture, vUv).rgb;
    // secondStepCol *= 1.125;

    vec3 thirdStep = texture2D(uBakedThirdStepTexture, vUv).rgb;
    // thirdStep *= 1.125;

    vec3 fac = vec3(197, 197, 197);

    if (firstStepCol.rgb == fac /255.) {
        firstStepCol = neutralCol;
    } else {
        firstStepCol *= 1.125;
    }

    if (secondStepCol.rgb == fac /255.) {
        secondStepCol = firstStepCol;
    } else {
        secondStepCol *= 1.125;
    }

     if (thirdStep.rgb == fac /255.) {
        thirdStep = secondStepCol;
    } else {
        thirdStep *= 1.125;
    }

    float time = uTime * 0.0375;

    float noise = texture2D(uNoiseTexture, vUv * 1. + time).r;
    noise = noise * 3.;
    noise = pow(noise, 1.25);

    // noise *= uProgress;

    // vec3 progressCol = neutralCol * 0.9;
    // vec3 finalProgressCol = mix(neutralCol, progressCol, noise);
    // gl_FragColor = vec4(vec3(neutralCol ), 1.- facing);

    vec3 finalCol = mix(neutralCol, firstStepCol, uFirstProgress);
    finalCol = mix(finalCol, secondStepCol, uSecondProgress);
    finalCol = mix(finalCol, thirdStep, uThirdProgress);

    gl_FragColor = vec4(vec3(finalCol ), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}