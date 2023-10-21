import { CORE } from "./core.js";
import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js"
import { Mat4, Quaternion } from "./math.js"
import { PositionBuffer, IndexBuffer, Uniform4x4Matrix } from "./buffers.js";
import { RenderablePackage } from "./package.js";
export class Mesh{
    /**
     * A 3D Object made of several triangles
     * @param {Array<Number>} vertices
     * @param {Array<Number>} indices
     * @param {Material} material
     * @param {Boolean} manuallySpecifyNormals Do not auto-generate normals
     * @param {Array<Number>} normals
     * @param {Array<Number>|Array<Array<Number>>} texCoords
     * @param {Boolean} texSflipped If Texture
     * @param {Boolean} texTflipped
     */
    constructor(vertices,indices,material,manuallySpecifyNormals,normals,texCoords,texSflipped=false,texTflipped=false){
        if(manuallySpecifyNormals){
            console.log("Not interpolated")
            this.normals = normals;
            this.vertices = vertices;
            this.indices = indices;
            if(this.indices[0] instanceof Array){
                var newindices = []
                for(var i=0; i<this.indices.length; i++){
                    newindices.push(...this.indices[i]);
                }
                this.indices = newindices;
            }
            if(texCoords instanceof Array && texCoords[0] instanceof Array){
                for(var i=0; i<texCoords.length; i++){
                    this.texCoords.push(texCoords[i][0],texCoords[i][1])
                }
            } else if (texCoords instanceof Array){
                this.texCoords = texCoords;
                if(texSflipped||texTflipped){
                    if(texSflipped){
                        for(var i=0; i<this.texCoords.length; i+=2){
                            this.texCoords[i] = 1-this.texCoords[i]
                        }
                    }
                    if(texTflipped){
                        for(var i=0; i<this.texCoords.length; i+=2){
                            this.texCoords[i+1] = 1-this.texCoords[i]
                        }
                    }
                }
            }
        } else {
            this.vertices = [];
            this.indices = [];
            this.normals = [];
            this.texCoords = [];
            var vd = vertices;
            if(texCoords instanceof Array && texCoords[0] instanceof Array){
                for(var i=0; i<texCoords; i++){
                    this.texCoords.push(texCoords[i][0],texCoords[i][1])
                }
            } else if (texCoords instanceof Array){
                this.texCoords = texCoords;
            } else {
                this.texCoords = []
            }
            if(indices.length >= 3){
            for(var i=0; i<indices.length/3; i++){
                var idx = [indices[i*3]*3,indices[i*3+1]*3,indices[i*3+2]*3]
                var triangle = [
                    [vd[idx[0]],vd[idx[0]+1],vd[idx[0]+2]],
                    [vd[idx[1]],vd[idx[1]+1],vd[idx[1]+2]],
                    [vd[idx[2]],vd[idx[2]+1],vd[idx[2]+2]]
                ]
                var normal = CORE.math.triangle.getSurfaceNormal(...triangle)
                this.vertices.push(...[...triangle[0],...triangle[1],...triangle[2]])
                this.normals.push(...[...normal,...normal,...normal])
                this.indices.push(i*3,i*3+1,i*3+2)
            }
            }
            //console.log(this.texCoords)
        }
        
        this.material = material;
        this.visible = true;
        this.tags = undefined;
        this.transform = {
            position:[0,0,0],
            rotation:{
                euler:[0,0,0],
                quaternion:Quaternion.fromEulerAngles([0,0,0])
            },
            scale:[1,1,1],
            transformStayedSame:false,
            transformMatrix:null,
            normalMatrix:null
        }
        this.buffers = {
            position:null,
            index:null,
            normal:null,
            texcoord:null,
            built:false
        }
        
    }
    /**
     * Flips the S(U) texture coordinate of the mesh
     */
    flipSCoordinate(){
        for(var i=0; i<this.texCoords.length; i+=2){
            this.texCoords[i] = 1-this.texCoords[i]
        }
    }
    /**
     * Flips the T(V) texture coordinate of the mesh
     */
    flipTCoordinate(){
        for(var i=0; i<this.texCoords.length; i+=2){
            this.texCoords[i+1] = 1-this.texCoords[i+1]
        }
    }
    addTag(tag){
        this.tags.push(tag);
    }
    removeTag(){
        this.tag = undefined;
    }
    scale(vector){
        this.transform.scale = vector;
        this.transform.transformStayedSame = false;
    }
    /**
     * 
     * @param {Array<Number>|Quaternion} rotation 
     * @param {Number} rotationType 
     */
    rotate(rotation){
        this.transform.rotation.euler = CORE.math.vec3.add(rotation,this.transform.rotation.euler);
        this.transform.rotation.quaternion = Quaternion.fromEulerAngles(this.transform.rotation.euler);
        this.transform.transformStayedSame = false;
    }
    /**
     * 
     * @param {Quaternion|Array<Number>} rotation 
     * @param {Number} rotationType 
     */
    setRotation(rotation,rotationType = CORE.enum.EULER_ANGLES){
        if(rotationType == CORE.enum.EULER_ANGLES){
            this.transform.rotation.euler = rotation;
            this.transform.rotation.quaternion = Quaternion.fromEulerAngles(this.transform.rotation.euler);
        } else if(rotationType == CORE.enum.QUATERNION){
            this.transform.rotation.quaternion = rotation;
            this.transform.rotation.euler = rotation.toEulerAngles();
        }
    }
    translate(vector){
        this.transform.position = CORE.math.vec3.add(vector,this.transform.position)
        this.transform.transformStayedSame = false;
    }
    setMaterial(material){
        this.material = material;
    }
    rebuildBuffers(){
        this.buffers.built = false
    }
    /**
     * 
     * @param {Renderer} renderer 
     * @param {Mat4} viewMatrix 
     * @param {Mat4} projectionMatrix 
     * @param {Array} otherthings 
     * @param {Scene} scene 
     * @returns 
     */
    convertToPackage(renderer,viewMatrix,projectionMatrix,otherthings,scene){
        if(!this.transform.transformStayedSame){
            var matrix = new Mat4();
            matrix.scale(this.transform.scale)
            matrix.rotate(this.transform.rotation.euler)
            matrix.translate(this.transform.position)
            this.transform.transformMatrix = matrix;
            this.transform.transformStayedSame = true;
            var normalMatrix = new Mat4()
            normalMatrix.set(matrix)
            normalMatrix.invert()
            normalMatrix.transpose()
            this.transform.normalMatrix = normalMatrix;
        }
        const rebuild = scene.built;
        if(rebuild){
            this.material.resetBuild();
        }
        var builtMaterial = this.material.build(renderer,this,scene);
        var shaderProgram = builtMaterial.shaderProgram;
        var parameters = builtMaterial.parameters;
        var newParameters = [];
        var newparameter;
        for(var i=0; i<parameters.length; i++){
            if(!parameters[i].reusable){
                newparameter = new parameters[i].type(renderer,parameters[i].value,parameters[i].attribute);
                newParameters.push(newparameter);
            } else {
                if(this.material[parameters[i].paramname]){
                    newParameters.push(this.material[parameters[i].paramname]);
                } else {
                    newparameter = new parameters[i].type(renderer,parameters[i].value,parameters[i].attribute);
                    newParameters.push(newparameter);
                    this.material[parameters[i].paramname] = newparameter
                }
            }
        }
        if(this.buffers.built){
            var positionBuffer = this.buffers.position;
            var indexBuffer = this.buffers.index;
            var normalBuffer = this.buffers.normal;
        } else {
            var positionBuffer = new PositionBuffer(renderer,this.vertices,"vP");
            var indexBuffer = new IndexBuffer(renderer,this.indices);
            var normalBuffer = new PositionBuffer(renderer,this.normals,"vN");
            this.buffers.position = positionBuffer;
            this.buffers.index = indexBuffer;
            this.buffers.normal = normalBuffer;
        }
        
        var transformUniform = new Uniform4x4Matrix(renderer,this.transform.transformMatrix,"wM");
        var viewUniform = new Uniform4x4Matrix(renderer,viewMatrix,"vM");
        var projectionUniform = new Uniform4x4Matrix(renderer,projectionMatrix,"pM");
        var normalUniform = new Uniform4x4Matrix(renderer,this.transform.normalMatrix,"nM")
        var shaderInput = [positionBuffer,normalBuffer,indexBuffer,transformUniform,viewUniform,projectionUniform,normalUniform];
        shaderInput = shaderInput.concat(newParameters);
        shaderInput = shaderInput.concat(otherthings);
        if(this.texCoords?this.texCoords.length:0){
            if(this.buffers.built){
                var textureBuffer = this.buffers.texcoord;
            } else {
                var textureBuffer = new TextureCoordinateBuffer(renderer,this.texCoords,"vTC");
                this.buffers.texcoord = textureBuffer;
            }
            shaderInput.push(textureBuffer)
        }
        var renderType = builtMaterial.renderType?builtMaterial.renderType:CORE.enum.TRIANGLES
        //constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params)
        var renderpackage = new RenderablePackage(shaderProgram,shaderInput,CORE.enum.ELEMENTS,renderType,{
            numElements:this.indices.length,
            offset:0
        })
        return renderpackage;
    }
}