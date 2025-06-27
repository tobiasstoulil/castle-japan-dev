vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay) {
    
    vec3 lightVector = position - lightPosition;
    float lightDistance = length(lightVector);
    vec3 lightDirection = normalize(lightVector);

    vec3 lightReflection = reflect(lightDirection, normal);

    float shading = - dot(lightDirection, normal);
    shading = max(0., shading);

    float specular = - dot(lightReflection, viewDirection); //odraz světla
    specular = max(0., specular);
    specular = pow(specular, specularPower);


    float decay = 1. - lightDistance * lightDecay;
    decay = max(0., decay);
    
    return (lightColor * lightIntensity) * (shading + specular) * decay;

;
}