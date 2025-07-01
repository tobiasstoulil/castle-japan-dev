uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main()
{
    vUv = uv;    

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    
    float time = uTime * 0.8;
    modelPosition.x += sin(uv.y * modelPosition.x * 5. + time * 1.25) * 0.085;
    modelPosition.z += sin(uv.y * modelPosition.z * 1.75 + time * 2.) * 0.095;



    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vWorldPosition = modelPosition.xyz;
}