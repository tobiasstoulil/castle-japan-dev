uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main()
{
    vUv = uv;    

    float time = 0.;
    vec3 newPos = position;

    if(uTime != 0.) {
        time = uTime * 0.85;
        newPos.z += sin(uv.x * position.x * 0.5 + time * 1.25) * 0.05;
        newPos.x += sin(uv.x * position.x * 0.75 + time * 2.) * 0.075;
    }




    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vWorldPosition = modelPosition.xyz;
}