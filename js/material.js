import {CORE} from "./core.js"

class Material{
    /**
     * 
     * @param {*} params 
     * @param {*} buildFunction 
     * @param {*} properties 
     */
    constructor(buildFunction,properties){
        this.lastCompiled = false;
        this.compiled = null;
        if(properties){
            for(const [key,value] of Object.entries(properties)){
                this[key] = value;
            }
        }
        if(!buildFunction){
            buildFunction = function(renderer,mesh,scene,material){
                if(!material.lastCompiled){
                    let vertexShaderSource = `
#define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
#define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
precision mediump float;
attribute vec3 vP;
attribute vec3 vN;
uniform mat4 wM;
uniform mat4 vM;
uniform mat4 pM;
uniform mat4 nM;
uniform vec3 viewPosition;
uniform vec4 lightPosition[MAXPLIGHTSOURCES];
varying mediump vec3 fN;
varying mediump vec3 fP;
varying mediump vec3 surfaceToView;
void main(void){
        vec4 position = wM*vec4(vP,1.0);
        gl_Position = pM*vM*position;
        fN = (wM*vec4(vN,0.0)).xyz;
        fP = position.xyz;
        surfaceToView = (vec4(viewPosition,1.0) - position).xyz;
}
                    
    `
                    let fragmentShaderSource = `
#define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
#define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
precision mediump float;
precision mediump float;

varying mediump vec3 fN;
varying mediump vec3 fP;
varying mediump vec3 surfaceToView;

uniform vec4 lightDirection[MAXDLIGHTSOURCES];
uniform vec4 lightPosition[MAXPLIGHTSOURCES];
uniform vec3 lightCounts;
uniform vec4 pointLightColors[MAXPLIGHTSOURCES];
uniform vec3 pointLightSpecularColors[MAXPLIGHTSOURCES];
uniform vec3 directionalLightColors[MAXDLIGHTSOURCES];
uniform vec4 objectColor;
uniform float shininess;
    void main(void){
        gl_FragColor = vec4(1.0,0.0,1.0,1.0);
    }
    `
                    let vertexShader = new VertexShader(vertexShaderSource);
                    let fragmentShader = new FragmentShader(fragmentShaderSource);
                    let shaderProgram = new ShaderProgram(renderer,vertexShader,fragmentShader)
                    material.lastCompiled = true;
                    material.compiled = {
                        shaderProgram:shaderProgram,
                        parameters:[]
                    }
                    return material.compiled;
                } else {
                    return material.compiled;
                }
            }
        }
        this.build = function(renderer,mesh,scene){
            if(this.lastCompiled){
                return this.compiled
            }
            return buildFunction(
                renderer,
                mesh,
                scene,
                this,
            );
        }
    }
    resetBuild(){
        this.lastCompiled = false;
        this.compiled = null;
    }
}

class SingleColorMaterial extends Material{
    constructor(color,shininess,lightingType=CORE.enum.PHONG_LIGHTING){
        /**
         * 
         * @param {Renderer} renderer 
         * @param {Mesh} mesh 
         * @param {Scene} scene 
         * @param {Material} material 
         * @returns 
         */
        function buildFunction(renderer,mesh,scene,material){
                let vertexShaderSource = `
#define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
#define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}

precision mediump float;

attribute vec3 vP;
attribute vec3 vN;

uniform mat4 wM;
uniform mat4 vM;
uniform mat4 pM;
uniform mat4 nM;
uniform vec3 viewPosition;
uniform vec4 lightPosition[MAXPLIGHTSOURCES];

varying mediump vec3 fN;
varying mediump vec3 fP;
varying mediump vec3 surfaceToView;

void main(void){
    vec4 position = wM*vec4(vP,1.0);
    gl_Position = pM*vM*position;
    fN = (wM*vec4(vN,0.0)).xyz;
    fP = position.xyz;
    surfaceToView = (vec4(viewPosition,1.0) - position).xyz;
}
`;
                let fragmentShaderSource = `
                #define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
                #define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
                ${CORE.shaderReference.FRAG_ATTR}
                uniform vec4 objectColor;
                void main(void){
                    ${CORE.shaderReference.setLightingShader(material.lightingType)}
                    gl_FragColor = objectColor;
                    gl_FragColor.rgb*=light*(lightColor * objectColor.rgb);
                    gl_FragColor.rgb+=specular*specularColor;
                }`;
                if(material.shininess<=0){
                    var shine=0
                } else {
                var shine = material.shininess*3
                shine = 251-CORE.math.clamp(shine,0,250)
                }
                let vertexShader = new VertexShader(vertexShaderSource);
                let fragmentShader = new FragmentShader(fragmentShaderSource);
                let shaderProgram = new ShaderProgram(renderer,vertexShader,fragmentShader);
                material.lastCompiled = true;
                material.compiled = {
                    shaderProgram:shaderProgram,
                    parameters:[
                        {
                            type:UniformVector4,
                            value:CORE.Color(material.color),
                            attribute:"objectColor"
                        },
                        {
                            type:UniformFloat,
                            value:shine,
                            attribute:"shininess"
                        }
                    ]
                }
                return material.compiled;
        }
        super(buildFunction,{
            "shininess":shininess,
            "color":color,
            "lightingType":lightingType
        })
    }
}
class TexturedMaterial extends Material{
    constructor(texture,shininess=0,lightingType=CORE.enum.BASIC_LIGHTING){
        function buildFunction(renderer,mesh,scene,material){
            if(!mesh.texCoords?!mesh.texCoords.length:0){
                throw Error("No texture coordinates are provided for this object!")
            }
            const vertexShaderSource = `
#define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
#define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}

precision mediump float;

attribute vec3 vP;
attribute vec3 vN;
attribute vec2 vTC;

uniform mat4 wM;
uniform mat4 vM;
uniform mat4 pM;
uniform mat4 nM;
uniform vec3 viewPosition;
uniform vec4 lightPosition[MAXPLIGHTSOURCES];

varying mediump vec3 fN;
varying mediump vec3 fP;
varying mediump vec3 surfaceToView;
varying mediump vec2 fTC;

void main(void){
    fTC = vTC;
    vec4 position = wM*vec4(vP,1.0);
    gl_Position = pM*vM*position;
    fN = (wM*vec4(vN,0.0)).xyz;
    fP = position.xyz;
    surfaceToView = (vec4(viewPosition,1.0) - position).xyz;
    
}`
            const fragmentShaderSource = `
#define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
#define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
${CORE.shaderReference.FRAG_ATTR}
uniform sampler2D texSamp;
varying mediump vec2 fTC;
void main(void){
    ${CORE.shaderReference.setLightingShader(material.lightingType)}
    gl_FragColor = vec4(texture2D(texSamp,fTC));
    gl_FragColor.rgb *= light*(lightColor*gl_FragColor.rgb);
    gl_FragColor.rgb += specular*specularColor;
}`
            let vertexShader = new VertexShader(vertexShaderSource)
            let fragmentShader = new FragmentShader(fragmentShaderSource)
            let shaderProgram = new ShaderProgram(renderer,vertexShader,fragmentShader)
            material.lastCompiled = true;
            material.compiled = {
                shaderProgram:shaderProgram,
                parameters:[
                    {
                        type:TextureBuffer,
                        value:material.texture,
                        reusable:1,
                        paramname:"textureBuffer"
                    },
                    {
                        type:UniformFloat,
                        value:material.shininess,
                        attribute:"shininess"
                    }
                ]
            }
            return material.compiled
        }
        super(buildFunction,{
            "texture":texture,
            "shininess":shininess,
            "lightingType":lightingType
        })
        this.textureBuffer = null
    }
}
class TextureCoordinatesDebug extends Material{
    constructor(){
        function buildFunction(render,mesh,scene,material){
            const vshadersource = `
            #define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
            #define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
            precision mediump float;
            attribute vec3 vP;
            attribute vec3 vN;
            attribute vec2 vTC;
            uniform mat4 wM;
            uniform mat4 vM;
            uniform mat4 pM;
            uniform mat4 nM;
            uniform vec3 viewPosition;
            uniform vec4 lightPosition[MAXPLIGHTSOURCES];
            varying mediump vec3 fN;
            varying mediump vec3 fP;
            varying mediump vec2 fTC;
            varying mediump vec3 surfaceToView;
            void main(void){
                    fTC = vTC;
                    vec4 position = wM*vec4(vP,1.0);
                    gl_Position = pM*vM*position;
                    fN = (wM*vec4(vN,0.0)).xyz;
                    fP = position.xyz;
                    surfaceToView = (vec4(viewPosition,1.0) - position).xyz;
            }
            `
            const fshadersource = `
            #define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
            #define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
            precision mediump float;
            precision mediump float;
            
            varying mediump vec3 fN;
            varying mediump vec3 fP;
            varying mediump vec2 fTC;
            varying mediump vec3 surfaceToView;
            
            uniform vec4 lightDirection[MAXDLIGHTSOURCES];
            uniform vec4 lightPosition[MAXPLIGHTSOURCES];
            uniform vec3 lightCounts;
            uniform vec4 pointLightColors[MAXPLIGHTSOURCES];
            uniform vec3 pointLightSpecularColors[MAXPLIGHTSOURCES];
            uniform vec3 directionalLightColors[MAXDLIGHTSOURCES];
            uniform float shininess;
                void main(void){

                    gl_FragColor = vec4(fTC,0.0,1.0);
                }
            `
            const vshader = new VertexShader(vshadersource)
            const fshader = new FragmentShader(fshadersource)
            const shaderProgram = new ShaderProgram(render,vshader,fshader)
            material.lastCompiled = true
            material.compiled = {
                shaderProgram:shaderProgram,
                parameters:[]
            }
            return material.compiled
        }
        super(buildFunction,{})
    }
}

class WireframeMaterial extends Material{
    constructor(color,lineWidth){
        function buildFunction(render,mesh,scene,material){
            const vshadersource = `
            #define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
            #define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
            precision mediump float;
            attribute vec3 vP;
            attribute vec3 vN;
            attribute vec2 vTC;
            uniform mat4 wM;
            uniform mat4 vM;
            uniform mat4 pM;
            uniform mat4 nM;
            uniform vec3 viewPosition;
            uniform vec4 lightPosition[MAXPLIGHTSOURCES];
            varying mediump vec3 fN;
            varying mediump vec3 fP;
            varying mediump vec3 surfaceToView;
            void main(void){
                    vec4 position = wM*vec4(vP,1.0);
                    gl_Position = pM*vM*position;
                    fN = (wM*vec4(vN,0.0)).xyz;
                    fP = position.xyz;
                    surfaceToView = (vec4(viewPosition,1.0) - position).xyz;
            }
            `
            const fshadersource = `
            #define MAXDLIGHTSOURCES ${scene.lighting.maxDirectionalLightSourcesPerMesh}
            #define MAXPLIGHTSOURCES ${scene.lighting.maxPointLightSourcesPerMesh}
            precision mediump float;
            precision mediump float;
            
            varying mediump vec3 fN;
            varying mediump vec3 fP;
            varying mediump vec3 surfaceToView;
            
            uniform vec4 lightDirection[MAXDLIGHTSOURCES];
            uniform vec4 lightPosition[MAXPLIGHTSOURCES];
            uniform vec3 lightCounts;
            uniform vec4 pointLightColors[MAXPLIGHTSOURCES];
            uniform vec3 pointLightSpecularColors[MAXPLIGHTSOURCES];
            uniform vec3 directionalLightColors[MAXDLIGHTSOURCES];
            uniform vec4 objectColor;
            uniform float shininess;
                void main(void){
                    gl_FragColor = objectColor;
                }
            `
            const vshader = new VertexShader(vshadersource);
            const fshader = new FragmentShader(fshadersource);
            const shaderProgram = new ShaderProgram(render,vshader,fshader);
            material.lastCompiled = true;
            material.compiled = {
                shaderProgram:shaderProgram,
                renderType:CORE.enum.LINES,
                parameters:[
                    {
                        type:UniformVector4,
                        value:CORE.Color(material.color),
                        attribute:"objectColor"
                    }
                ]
            }
            return material.compiled
        }
        super(buildFunction,{
            "color":color
        })
    }
}
export {WireframeMaterial,Material,TexturedMaterial,TextureCoordinatesDebug,SingleColorMaterial}