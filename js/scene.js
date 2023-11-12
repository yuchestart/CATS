import { Renderer } from "./renderer.js";
import { CORE } from "./core.js";
import { Mat4 } from "./math.js";
import { Mesh } from "./mesh.js";
import { SpotLight, AmbientLight, DirectionalLight, PointLight } from "./light.js";
import { UniformVector3, UniformVector4 } from "./buffers.js";
export class Scene{
    /**
     * Creates a space where 3D objects are placed. 
     * The viewer views a scene through the camera which is placed inside.
     * @param {Renderer} renderer 
     */
    constructor(renderer){
        this.renderer = renderer;
        this.camera = {
            position:[0,0,0],
            direction:[0,0,0],
            fovy:70,
            near:CORE.math.EPSILON,
            far:100,
            lastViewMatrix:new Mat4(),
            viewMatrixInitialized:false
        };
        /**
         * @type {Array<Mesh>}
         */
        this.objects = [];
        /**
         * @type {Array<DirectionalLight|PointLight|AmbientLight|SpotLight>}
         */
        this.lights = [];
        this.bgcolor = [0,0,0,1];
        this.lighting = {
            maxDirectionalLightSourcesPerMesh:10,
            maxPointLightSourcesPerMesh:20,
            defaultAmbientLight:new AmbientLight(0.1,"#FFFFFF")
        }
        this.built = false;
    }
    //Camera controls
    //#region 
    /**
     * Moves the camera by a vector.
     * @param {Array} vector 
     */
    moveCamera(vector){
        this.camera.position = CORE.math.vec3.add(this.camera.position,vector);
        this.camera.viewMatrixInitialized = false;
    }
    /**
     * Rotates the camera by specified angles in the vector.
     * The angles in the vectors are specified as:
     * [X,Y,Z]
     * @param {Array} vector 
     */
    rotateCamera(vector){
        this.camera.direction = CORE.math.vec3.add(this.camera.direction,vector);
        this.camera.viewMatrixInitialized = false;
    }
    /**
     * Sets the field of view angle for the camera.
     * Range:
     * 1 degree to 179 degrees
     * @param {Number} fov 
     */
    setFOV(fov){
        this.camera.fovy = fov;
    }
    //#endregion
    /**
     * Makes all of the meshes in the scene rebuild their materials.
     */
    rebuild(){
        this.built = false;
    }
    /**
     * Set a lighting attribute.
     * @param {String} attributeName 
     * @param {*} value 
     */
    adjustLightingAttribute(attributeName,value){
        this.lighting[attributeName] = value;
        this.rebuild()
    }
    /**
     * Used internally by CATS to generate a view matrix
     * @returns 
     */
    projectCamera(){
        if(!this.camera.viewMatrixInitialized){
            //Ugh I hate math so much
            var v = [0,0,-1], vector=[0,1,0];
            //ROTATE Z
            var sin = Math.sin(CORE.math.toRadians(this.camera.direction[2])),cos=Math.cos(CORE.math.toRadians(this.camera.direction[2]))
            var a = v[0],b=v[1]
            v[0] = a*cos - b*sin;
            v[1] = a*sin + b*cos;
            a = vector[0],b=vector[1]
            vector[0] = a*cos - b*sin;
            vector[1] = a*sin + b*cos;
            //ROTATE X
            var sin = Math.sin(CORE.math.toRadians(this.camera.direction[0])),cos=Math.cos(CORE.math.toRadians(this.camera.direction[0]))
            var a = v[2],b=v[1]
            v[2] = a*cos - b*sin;
            v[1] = a*sin + b*cos;
            var a = vector[2],b=vector[1]
            vector[2] = a*cos - b*sin;
            vector[1] = a*sin + b*cos;
            //ROTATE Y
            var sin = Math.sin(CORE.math.toRadians(this.camera.direction[1])),cos=Math.cos(CORE.math.toRadians(this.camera.direction[1]))
            var a = v[0],b=v[2]
            v[0] = a*cos - b*sin;
            v[2] = a*sin + b*cos;
            var a = vector[0],b=vector[2]
            vector[0] = a*cos - b*sin;
            vector[2] = a*sin + b*cos;
            var viewMatrix = new Mat4();
            viewMatrix.lookAt(this.camera.position,CORE.math.vec3.add(this.camera.position,v),vector);
            this.camera.lastViewMatrix = viewMatrix;
            this.camera.viewMatrixInitialized = true;
        } else {
            var viewMatrix = this.camera.lastViewMatrix;
        }
        this.renderer.updateAspectRatio()
        var projectionMatrix = new Mat4();
        projectionMatrix.perspective(
            this.camera.fovy,
            this.renderer.aspect,
            this.camera.near,
            this.camera.far);
        return {
            viewMatrix:viewMatrix,
            projectionMatrix:projectionMatrix
        };
    }
    /**
     * Adds an object to the scene
     * @param {Mesh} object 
     * @returns {Number} The ID of the object
     */
    addObject(object){
        this.objects.push(object);
        return this.objects.length - 1;
    }
    /**
     * Adds a light to the scene
     * @param {DirectionalLight|PointLight|AmbientLight|SpotLight} light 
     * @returns {Number} The ID of the light.
     */
    addLight(light){
        this.lights.push(light)
        return this.lights.length-1
    }
    /**
     * 
     * @param {Number} id 
     */
    removeObject(id){
        delete this.objects[id]
    }
    removeLight(id){
        delete this.lights[id]
    }
    clear(){
        this.objects = [];
        this.lights = [];
    }
    setBackground(color){
        this.bgcolor = CORE.Color(color)
    }
    /**
     * Gets all objects with this tag
     * @param {String} tag
     * @returns {Array<Number>} ID of the objects
     */
    getObjectsWithTag(tag){
        var objectsWithTags = [];
        for(var i=0; i<this.objects.length; i++){
            if(tag in this.objects[i].tags){
                objectsWithTags.push(i);
            }
        }
        return objectsWithTags;
    }
    render(){
        this.renderer.clear(...this.bgcolor);
        if(!(this.renderer.canvas.width==this.renderer.prevCanvasDimensions.width && 
            this.renderer.canvas.height==this.renderer.prevCanvasDimensions.height)){
            this.renderer.prevCanvasDimensions.width = this.renderer.canvas.width;
            this.renderer.prevCanvasDimensions.height = this.renderer.canvas.height;
            this.renderer.canvas.width = this.renderer.canvas.clientWidth;
        }
        var matrices = this.projectCamera();
        var divector = [];
        var pivector = [];
        var amvector = [];
        var sivector = [];
        var lightColors = {
            directional:[],
            point:[],
            spot:[]
        };
        var specularLightColors = {
            point:[],
            spot:[]
        }
        var otherUniforms = [];
        var lightCount = {
            directional:0,
            point:0,
            spot:0,
            ambient:0
        };
        var spotvectors = []
        for(var i=0; i<this.lights.length; i++){
            var processedLight = this.lights[i].convertToData()
            switch(processedLight.type){
                case CORE.enum.DIRECTIONAL_LIGHT:
                    divector.push(...processedLight.divector)
                    lightColors.directional.push(...processedLight.color)
                    lightCount.directional++;
                    break;
                case CORE.enum.POINT_LIGHT:
                    pivector.push(...processedLight.pivector)
                    lightColors.point.push(...processedLight.color)
                    specularLightColors.point.push(...processedLight.specularColor)
                    lightCount.point++;
                    break;
                case CORE.enum.AMBIENT_LIGHT:
                    amvector.push(...processedLight.vec);
                    lightCount.ambient++;
                    break;
                case CORE.enum.SPOT_LIGHT:
                    sivector.push(...processedLight.sivector);
                    lightColors.spot.push(...processedLight.color)
                    specularLightColors.spot.push(...processedLight.specularColor)
                    spotvectors.push(...processedLight.direction)
                    lightCount.spot++;
            }
        }
        var vectors = {
            "lightDirection":[divector,UniformVector4],
            "lightPosition":[pivector,UniformVector4],
            "ambientLights":[amvector,UniformVector4],
            "spotLightPosition":[sivector,UniformVector4],
            "directionalLightColors":[lightColors.directional,UniformVector3],
            "pointLightColors":[lightColors.point,UniformVector4],
            "spotLightColors":[lightColors.spot,UniformVector4],
            "pointLightSpecularColors":[specularLightColors.point,UniformVector3],
            "spotLightSpecularColors":[specularLightColors.spot,UniformVector3],
            "spotLightDirections":[spotvectors,UniformVector4]
        }
        for (const [key,value] of Object.entries(vectors)){
            if(value[0].length){
                var uniform = new value[1](this.renderer,value[0],key)
                otherUniforms.push(uniform)
            }
        }
        var lightCountVector = new UniformVector4(this.renderer,[lightCount.directional,lightCount.point,lightCount.spot,lightCount.ambient],"lightCounts")
        var viewPosVector = new UniformVector3(this.renderer,this.camera.position,"viewPosition")
        otherUniforms.push(lightCountVector);
        otherUniforms.push(viewPosVector);
        for(var i=0; i<this.objects.length; i++){
            try{
            var renderablePackage = this.objects[i].convertToPackage(this.renderer,matrices.viewMatrix,matrices.projectionMatrix,otherUniforms,this);
            this.renderer.drawPackage(renderablePackage,renderablePackage.typeOfRender);
            }catch(e){
                throw new Error(`An error occoured while trying to process object #${i} in scene.\n\n${e.stack}`)
            }
        }
    }
}
