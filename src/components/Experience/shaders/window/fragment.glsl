uniform sampler2D uNoiseTexture;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{


    // gl_FragColor = vec4(vec3(2. ), 1.- facing);
    gl_FragColor = vec4(vec3(1.5 ), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}