uniform float uTime;
uniform float uProgress;
uniform vec3 uCharPosition;
uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;
uniform sampler2D uVornoiTexture;
uniform sampler2D uProgressTexture;

varying vec2 vUv;
varying vec3 vWorldPosition;

// varying vec3 vColor;

void main()
{
    vec3 col = texture2D(uTexture, vUv ).rgb;
    vec3 progressCol = texture2D(uProgressTexture, vUv ).rgb;

    float time = uTime * 0.0375;

    float noise = texture2D(uNoiseTexture, vUv * 4. + vec2(4. + time, 5. - time)).r;
    noise = noise * 6.;
    noise = pow(noise, 0.9);


    float dist = distance(vWorldPosition, uCharPosition);
    // float dist = distance(vWorldPosition + noise, uPoint);
    dist = 1.- smoothstep(-0.5, 2. + noise, dist);

    // vec3 baseCol = vec3(0.8);

    vec3 finalCol = mix(col, col * 0.6, dist);
     progressCol = mix(progressCol, progressCol * 0.6, dist);
    // finalCol *= 1.28;
    // finalCol *= 1.1825;

    vec3 finalProgresCol = mix(finalCol, progressCol, uProgress * 2.);
    finalProgresCol *= 1.28;

    gl_FragColor = vec4(vec3(finalProgresCol), 1.0);

    // gl_FragColor = vec4(vec3(road), 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}