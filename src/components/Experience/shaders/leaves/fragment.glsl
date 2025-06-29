uniform sampler2D uBaseColor;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    vec4 col = texture2D(uBaseColor, vUv);
    col.rgb *= 1.1;

    gl_FragColor = col;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}