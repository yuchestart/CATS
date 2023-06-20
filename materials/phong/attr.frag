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
uniform vec3 spotLightColors[MAXPLIGHTSOURCES];
uniform vec4 spotLightPosition[MAXPLIGHTSOURCES];
uniform vec4 ambientLights[MAXDLIGHTSOURCES];
uniform vec4 objectColor;
uniform float shininess;