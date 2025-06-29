
varying vec2 vUv;
varying vec3 vWorldPosition;

// varying vec3 vColor;


void main()
{

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;


    // vColor = color.xyz;
    vUv = uv;    
    vWorldPosition = modelPosition.xyz;
}