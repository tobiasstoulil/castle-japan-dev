vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower) {
    
    vec3 lightDirection = normalize(vec3(0., 0., 0.) - lightPosition);
    vec3 lightReflection = reflect(lightDirection, normal);
    
    float shading = - dot(lightDirection, normal);
    shading = max(0., shading);

    float specular = - dot(lightReflection, viewDirection); //odraz světla
    specular = max(0., specular);
    specular = pow(specular, specularPower);


    return lightColor * lightIntensity * shading + (specular * lightColor * lightIntensity);
}