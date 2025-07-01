uniform sampler2D uNeutralTexture;

varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{


    vec3 neutralCol = texture2D(uNeutralTexture, vUv).rgb;
    neutralCol *= 1.1;


    // gl_FragColor = vec4(vec3(neutralCol ), 1.- facing);
    gl_FragColor = vec4(vec3(neutralCol ), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}