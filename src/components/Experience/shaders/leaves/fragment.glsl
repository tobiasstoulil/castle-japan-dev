uniform sampler2D uBaseColor;
uniform sampler2D uNoiseTexture;
uniform vec3 uCharPosition;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    vec4 col = texture2D(uBaseColor, vUv);
    col.rgb *= 1.2;
    
    float noise = texture2D(uNoiseTexture, vUv).r;
    noise = pow(noise * 5., 0.5);
    
    if(col.r <= 0.275) {
        discard;
    }

    float dist = distance(uCharPosition.xz + vec2(6., 6.), vWorldPosition.xz);
    dist = smoothstep(0., 10., dist + noise);
    dist = pow(dist, 27.5);

    float finalAlpha = mix(0., col.a, dist);

    gl_FragColor = vec4(vec3(col.rgb), finalAlpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}