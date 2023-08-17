precision mediump float;

        varying mediump vec3 fN;
        varying mediump vec3 fP;
        varying mediump vec3 surfaceToView;

        uniform vec4 lightDirection[MAXDLIGHTSOURCES];
        uniform vec4 lightPosition[MAXPLIGHTSOURCES];
        uniform vec4 lightCounts;
        uniform vec4 pointLightColors[MAXPLIGHTSOURCES];
        uniform vec3 pointLightSpecularColors[MAXPLIGHTSOURCES];
        uniform vec3 directionalLightColors[MAXDLIGHTSOURCES];
        uniform vec4 spotLightColors[MAXPLIGHTSOURCES];
        uniform vec4 spotLightPosition[MAXPLIGHTSOURCES];
        uniform vec4 spotLightSpecularColors[MAXPLIGHTSOURCES];
        uniform vec4 spotLightDirection[MAXPLIGHTSOURCES];
        uniform vec4 ambientLights[MAXDLIGHTSOURCES];
        
        uniform float shininess;
        
void main(void){
int ndLights = int(lightCounts.x);
        int npLights = int(lightCounts.y);
        int naLights = int(lightCounts.w);
        int nsLights = int(lightCounts.z);
        if(ndLights>MAXDLIGHTSOURCES){
            ndLights = MAXDLIGHTSOURCES;
        }
        if(naLights>MAXDLIGHTSOURCES){
            naLights = MAXDLIGHTSOURCES;
        }
        if(npLights>MAXPLIGHTSOURCES){
            npLights = MAXPLIGHTSOURCES;
        }
        if(nsLights>MAXPLIGHTSOURCES){
            nsLights = MAXPLIGHTSOURCES;
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
            lightColor+=directionalLightColors[i];
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
                continue;
            }
            float specularIncrement = 0.0;
            if(increment>0.0){
                specularIncrement = pow(dot(fN,halfVector),shininess);
            }
            if(specularIncrement<0.0){
                specularIncrement = 0.0;
            }
            specularColor += pointLightSpecularColors[i].rgb;
            specular+=specularIncrement;
        }
        //Spot
        
        for(int i=0; i<MAXPLIGHTSOURCES; i++){
            if(i>=nsLights){
                break;
            }
            vec3 surfaceToLight = normalize(spotLightPosition[i].xyz - fP);
            vec3 surfaceToView = normalize(surfaceToView);
            vec3 halfVector = normalize(surfaceToLight+surfaceToView);
            float distance = pow(
                surfaceToLight.x*surfaceToLight.x+
                surfaceToLight.y*surfaceToLight.y+
                surfaceToLight.z*surfaceToLight.z,0.5
            );
            float subtraction;
            if(distance<=spotLightColors[i].w){
                subtraction=0.0;
            } else {
                float range = spotLightColors[i].w;
                subtraction = distance*(0.3/range)
            }
            float increment = 0.0
            float dotFromDirection = dot(surfaceToLight,-spotLightDirection.xyz);
            if (dotFromDirection >= spotLightDirection.w){
                increment = (dot(fN,surfaceToLight)-subtraction)*spotLightPosition.w;
            }
            if(increment<0.0){
                increment = 0.0;
            }
            lightColor += spotLightColors[i].rgb;
            light+=increment;
            if(shininess <= 0.0){
                continue;
            }
            float specularIncrement = 0.0;
            if(increment>0.0){
                specularIncrement = pow(dot(fN,halfVector),shininess);
            }
            if(specularIncrement<0.0){
                specularIncrement = 0.0;
            }
            specularColor += spotLightSpecularColors[i].rgb;
            specular+=specularIncrement;
        }
        
        //Ambient
        for(int i=0; i<MAXDLIGHTSOURCES; i++){
            if(i>=naLights){
                break;
            }
            lightColor += ambientLights[i].rgb;
            light+=ambientLights[i].w;
        }
        //light+=float(naLights);
        if(light > 1.0){
            light = 1.0;
        }else if(light < 0.0){
            light = 0.0;
        }
}