uniform vec3 uCharPosition;
uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;
uniform sampler2D uVornoiTexture;

varying vec2 vUv;
varying vec3 vWorldPosition;

varying vec3 vColor;

void main()
{
    vec3 col = texture2D(uTexture, vUv ).rgb;


    float noise = texture2D(uNoiseTexture, vUv * 10.).r;
    noise = pow(noise, 4.);
    noise = noise * 8.;

    float vornoi = texture2D(uVornoiTexture, vUv * vec2(2.3, 3.3)).r;
    float fac = smoothstep(0.075, 0.5, vornoi);
    float road = mix(0.8, 0.4, fac);

    float dist = distance(vWorldPosition, uCharPosition);
    // float dist = distance(vWorldPosition + noise, uPoint);
    dist = 1.- step(4. + noise, dist);

    // vec3 baseCol = vec3(0.8);

    vec3 finalCol = mix(col, vec3(road), dist);

    gl_FragColor = vec4(vec3(finalCol), 1.0);

    // gl_FragColor = vec4(vec3(road), 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}