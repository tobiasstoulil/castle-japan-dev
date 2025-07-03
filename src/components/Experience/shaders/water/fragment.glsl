uniform float uTime;
uniform sampler2D uAlpha;
uniform sampler2D uNoise;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    float a = texture2D(uAlpha, vUv).r;
    a = pow(a, 1.2);

    float time = uTime * 0.01375;
    float noise = texture2D(uNoise, vUv * 5.75 + vec2(time * 0.5,- time * 0.75)).b;
    noise = pow(noise * 1.35, 3.);
    noise = smoothstep(-1., 2., noise * 1.2);
    noise = pow(noise, 0.6);

    float distS = distance(vec2(0.7, 0.32), vUv);
    distS = smoothstep(0., 0.25, distS);
    //  distS = pow(distS, 0.5);

    noise *= distS;

    float noiseSmall = texture2D(uNoise, vUv * 8. + vec2(time * 1.,- time * 3.)).g;
    noiseSmall = pow(noiseSmall, 4.2);
    noiseSmall = smoothstep(-1., 1., noiseSmall * 5.);
    noiseSmall = pow(noiseSmall, 0.7);
    
    float noiseDistt = texture2D(uNoise, vUv * 17. + vec2(time * 5., time * 0.25)).r;
    noiseDistt = pow(noiseDistt, 4.);
    noiseDistt = smoothstep(-1., 1., noiseDistt * 5.);
    noiseDistt = pow(noiseDistt, 0.8);
    noiseDistt *= 1.4;

    float noiseIndex = texture2D(uNoise, vUv * 1.).b;
    // noiseIndex = pow(noiseIndex* 2., 10.);
    noiseIndex = step(0.5, noiseIndex);
    noiseIndex = clamp(0., 1., noiseIndex);
    

    float dist = distance(vec2(0.72, 0.31), vUv);
    dist = pow(dist, 0.3);
    dist = smoothstep(0., 0.79, dist);

    float circle = distance(vec2(0.4925, 0.33), vUv);
    // circle = 1. - circle;
    circle = smoothstep(0., 0.3, circle);
    circle = pow(circle, 0.95);
    circle = clamp(circle, 0., 1.);

    // float noiseDist = noiseSmall;
    noiseDistt *= 1.15;


    noiseSmall *= (1.- circle);
    noiseSmall *= 0.85;
    noiseSmall = clamp(noiseSmall, 0., 1.);

    // noise += noiseSmall;
    float finalNoise = mix(noise, noiseSmall, noiseSmall);

    float finalekNoise = mix(noiseDistt, finalNoise, dist);

    vec3 roundCol = vec3(237. / 256., 237. / 256., 239. / 256.);
    vec3 lake = mix(roundCol, vec3(finalekNoise), a);

    // if(lake.x <= 0.5) {
    //     discard;
    // }

    // float finalCol = mix(0.25, 1., lake);

    // if(a <= 0.8){
    //     discard;
    // }
    // finalekNoise *= 2.;


    gl_FragColor = vec4(vec3(finalekNoise * 1.525), pow(finalekNoise * a, 1.1));

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}