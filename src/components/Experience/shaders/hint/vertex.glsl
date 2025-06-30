
varying vec2 vUv;
varying vec3 vWorldPosition;

void main()
{
    vUv = uv;    

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vWorldPosition = modelPosition.xyz;
}