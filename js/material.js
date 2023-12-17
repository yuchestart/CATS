



// import { CORE } from "./core.js"
// import { VertexShader,FragmentShader,ShaderProgram } from "./shaders.js";

// export class MaterialConfig{
//     constructor(buffersUsed,bufferAttributes = {}){
//         this.bufferAttributes = bufferAttributes;
//         this.buffersUsed = buffersUsed;
//     }
// }

// export class CompiledMaterial{
//     constructor(shaderProgram,renderingType=CORE.enum.TRIANGLES,data={},dependencies=Material.defaultBufferDependencies){
//         this.shaderProgram = shaderProgram;
//         this.renderingType = renderingType;
//         /**
//          * This attribute stores data that the material will use.
//          */
//         this.data = data;
//         for(const key in config.buffersUsed){
//             if(!!config.bufferAttributes[key]){
//                 this.bufferDependencies[key] = config.bufferAttributes[key]
//             } else {
//                 this.bufferDependencies[key] = Material.bufferDependenciesDefaultAttribute[key]
//             }
//         }
//         this.dependencies = dependencies;
//     }
    
//     constructShaderDataList(){
//         const data = {};
//         for(const key in this.data){
//             data[key] = new this.data[key].type(this.data[key].data,);
//         }
//         return data;
//     }
// }

// export class Material{
//     //This is it for now, will rework later.
//     static bufferDependenciesDefaultAttribute = {
//         POSITION_BUFFER:"vP",
//         WORLD_TRANSFORM_MATRIX:"wM",
//         WORLD_VIEW_MATRIX:"vM",
//         CAMERA_PROJECTION_MATRIX:"pM",
//         NORMALS_BUFFER:"vN",
//         NORMALS_TRANSFORM_MATRIX:"nM",
//         TEXTURE_COORDINATE_BUFFER:"tC",
//         DIRECTIONAL_LIGHT_DIRECTIONS_UNIFORM:"lightDirection",
//         POINT_LIGHT_POSITIONS_AND_INTENSITIES_UNIFORM:"lightPosition",
//         LIGHT_COUNT_VECTOR:"lightCounts",
//         POINT_LIGHT_COLORS_AND_RANGE_UNIFORM:"pointLightColors",
//         POINT_LIGHT_SPECULAR_COLORS_UNIFORM:"pointLightSpecularColors",
//         DIRECTIONAL_LIGHT_COLORS_UNIFORM:"directionalLightColors",
//         SPOT_LIGHT_COLORS_UNIFORM:"spotLightColors",
//         SPOT_LIGHT_POSITIONS_AND_INTENSITIES_UNIFORM:"spotLightPosition",
//         SPOT_LIGHT_SPECULAR_COLORS_UNIFROM:"spotLightSpecularColors",
//         SPOT_LIGHT_DIRECTIONS_UNIFORM:"spotLightDirection",
//         AMBIENT_LIGHT_COLORS_AND_INTENSITIES_UNIFORM:"ambientLights"
//     };
//     static defaultBufferDependencies = ["POSITION_BUFFER","WORLD_TRANSFORM_MATRIX","WORLD_VIEW_MATRIX","CAMERA_PROJECTION_MATRIX"]
//     /**
//      * 
//      * @param {Function} buildFunction 
//      * @param {MaterialConfig} config 
//      */
//     static defaultConfig = new MaterialConfig(Material.defaultBufferDependencies)
//     constructor(buildFunction){
//         this.compiled = null;
//         this.previouslyCompiled = false;
        
//         /**
//          * REQUIRED PARAMETERS:
//          * renderer,mesh,scene,material
//          */
//         this.buildFunction = buildFunction?buildFunction:function (renderer,mesh,scene,material){
//             const vertexShaderSource = `
//             attribute vec3 vP;
//             uniform mat4 wM;
//             uniform mat4 vM;
//             uniform mat4 pM;
//             void main(void){
//                 gl_Position = pM*vM*wM*vec4(vP,1.0);
//             }`;
//             const fragmentShaderSource = `
//             void main(void){
//                 gl_FragColor = vec4(1.0,0.0,1.0,1.0);
//             }
//             `
//             const vertexShader = new VertexShader(vertexShaderSource);
//             const fragmentShader = new FragmentShader(fragmentShaderSource);
//             const shaderProgram = new ShaderProgram(renderer,vertexShader,fragmentShader);
//             const compiled = new CompiledMaterial(shaderProgram,CORE.enum.TRIANGLES);
//             return compiled;
//         }
//     }
//     recompile(){
//         this.previouslyCompiled = false;
//     }
//     /**
//      * 
//      * @param {Renderer} renderer 
//      * @param {Mesh} mesh 
//      * @param {Scene} scene 
//      * @returns {CompiledMaterial}
//      */
//     build(renderer,mesh,scene){
//         //console.log(this.buildFunction)
//         if(!this.previouslyCompiled){
//             this.compiled = this.buildFunction(renderer,mesh,scene,this);
//         }
//         return this.compiled;
//     }
// }
