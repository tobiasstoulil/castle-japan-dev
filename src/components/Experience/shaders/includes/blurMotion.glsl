vec4 blurMotion(sampler2D image, vec2 uv, vec2 direction, float strength, int samples) 
{
    vec4 color = vec4(0.0);
    
    for (int i = 0; i < samples; i++) 
    {
        float t = ( float( i ) / float( samples - 1 ) - 0.5 ) * strength;
        vec2 offset = direction * t;
        color += texture( image, uv + offset );
    }
    
    return color / float( samples );

}

 
