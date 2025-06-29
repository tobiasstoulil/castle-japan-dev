uniform float uTime;
uniform sampler2D uAlpha;
uniform sampler2D uNoise;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    float a = texture2D(uAlpha, vUv).r;
    a = pow(a, 2.);

    float time = uTime * 0.0075;
    float noise = texture2D(uNoise, vUv * 4. + vec2(time * 0.25,- time * 0.5)).b;
    noise = pow(noise * 1.35, 3.);
    noise = smoothstep(-1., 2., noise * 1.);
    noise = pow(noise, 0.5);

    float distS = distance(vec2(0.7, 0.32), vUv);
    distS = smoothstep(0., 0.25, distS);
    //  distS = pow(distS, 0.5);

    noise *= distS;

    float noiseSmall = texture2D(uNoise, vUv * 8. + vec2(time * 1.,- time * 3.)).g;
    noiseSmall = pow(noiseSmall, 4.2);
    noiseSmall = smoothstep(-1., 1., noiseSmall * 4.);
    noiseSmall = pow(noiseSmall, 0.5);

     float noiseDistt = texture2D(uNoise, vUv * 16. + vec2(time * 6., time * 0.25)).r;
    noiseDistt = pow(noiseDistt, 4.);
    noiseDistt = smoothstep(-1., 1., noiseDistt * 4.);
    noiseDistt = pow(noiseDistt, 0.5);
    

    float noiseIndex = texture2D(uNoise, vUv * 1.).b;
    // noiseIndex = pow(noiseIndex* 2., 10.);
    noiseIndex = step(0.5, noiseIndex);
    noiseIndex = clamp(0., 1., noiseIndex);



    float dist = distance(vec2(0.715, 0.3), vUv);
    dist = pow(dist, 0.3);
    dist = smoothstep(0., 0.75, dist);

    float circle = distance(vec2(0.4325, 0.325), vUv);
    // circle = 1. - circle;
    circle = smoothstep(0., 0.3, circle);
    circle = pow(circle, 0.8);
    circle = clamp(circle, 0., 1.);

    // float noiseDist = noiseSmall;
    noiseDistt *= 1.15;


    noiseSmall *= (1.- circle);
    noiseSmall *= 0.9;
    noiseSmall = clamp(noiseSmall, 0., 1.);

    // noise += noiseSmall;
    float finalNoise = mix(noise, noiseSmall, noiseSmall);

    float finalekNoise = mix(noiseDistt, finalNoise, dist);

    vec3 roundCol = vec3(237. / 256., 237. / 256., 239. / 256.);
    vec3 lake = mix(roundCol, vec3(finalekNoise), a);

    // float finalCol = mix(0.25, 1., lake);


    gl_FragColor = vec4(vec3(lake), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}