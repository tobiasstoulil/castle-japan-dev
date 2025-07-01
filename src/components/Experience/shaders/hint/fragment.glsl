uniform sampler2D uNoiseTexture;
uniform sampler2D uHintAlpha;
uniform float uAlphaProgress;


varying vec2 vUv;
varying vec3 vWorldPosition;


void main()
{
      
    float hintAlpha = texture2D(uHintAlpha, vUv).r;
    hintAlpha = pow(hintAlpha, 0.425);
    hintAlpha = hintAlpha - uAlphaProgress;


    float finalCol = mix(0.475, 0.275, hintAlpha);

    gl_FragColor = vec4(vec3(finalCol * 2.45), hintAlpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}