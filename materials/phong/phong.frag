int ndLights = int(lightCounts.x);
int npLights = int(lightCounts.y);
if(ndLights>MAXDLIGHTSOURCES){
    ndLights = MAXDLIGHTSOURCES;
}
if(npLights>MAXPLIGHTSOURCES){
    npLights = MAXPLIGHTSOURCES;
}
vec3 normal = normalize(fN);
float light = 0.0;
float specular = 0.0;
vec3 lightColor,specularColor;
//Directional
for(int i=0; i<MAXDLIGHTSOURCES; i++){
    if(i>=ndLights){
        break;
    }
    float increment = dot(normal,lightDirection[i].xyz*lightDirection[i].w);
    if(increment<0.0){
        increment = 0.0;
    }
    light+=increment;
}
//Point
for(int i=0; i<MAXPLIGHTSOURCES; i++){
    if(i>=npLights){
        break;
    }
    vec3 surfaceToLight = normalize(lightPosition[i].xyz - fP);
    vec3 surfaceToView = normalize(surfaceToView);
    vec3 halfVector = normalize(surfaceToLight+surfaceToView);
    float distance = pow(
        surfaceToLight.x*surfaceToLight.x+
        surfaceToLight.y*surfaceToLight.y+
        surfaceToLight.z*surfaceToLight.z,0.5
    );
    float subtraction;
    if(distance<=pointLightColors[i].w){
        subtraction = 0.0;
    } else {
        float range = pointLightColors[i].w;
        subtraction = distance*(0.3/range);
    }
    float increment = (dot(fN,surfaceToLight)-subtraction)*lightPosition[i].w;
    if(increment<0.0){
        increment = 0.0;
    }
    lightColor += pointLightColors[i].rgb;
    light+=increment;
    if(shininess <= 0.0){
        break;
    }
    float specularIncrement = 0.0;
    if(specularIncrement<0.0){
        specularIncrement = 0.0;
    }
    if(increment>0.0){
        specularIncrement = pow(dot(fN,halfVector),shininess);
    }
    specularColor += pointLightSpecularColors[i].rgb;
    specular+=specularIncrement;
}
if(light > 1.0){
    light = 1.0;
} else if(light<0.0){
    light = 0.0;
}