uniform sampler2D uNeutralTexture;
uniform sampler2D uNoiseTexture;


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
    neutralCol *= 1.1;


    // gl_FragColor = vec4(vec3(neutralCol ), 1.- facing);
    gl_FragColor = vec4(vec3(neutralCol ), 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>    
}