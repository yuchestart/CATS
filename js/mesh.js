import { CORE } from "./core.js";
import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js"
import { Mat4, Quaternion } from "./math.js"
//import { Material } from "./material.js"
import { PositionBuffer, IndexBuffer, Uniform4x4Matrix, TextureCoordinateBuffer } from "./buffers.js";
import { RenderablePackage, ShaderInput } from "./package.js";
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
            
            this.normals = normals;
            this.vertices = vertices;
            this.indices = indices;
            if(this.indices[0] instanceof Array){
                let newindices = []
                for(let i=0; i<this.indices.length; i++){
                    newindices.push(...this.indices[i]);
                }
                this.indices = newindices;
            }
            if(texCoords instanceof Array && texCoords[0] instanceof Array){
                for(let i=0; i<texCoords.length; i++){
                    this.texCoords.push(texCoords[i][0],texCoords[i][1])
                }
            } else if (texCoords instanceof Array){
                this.texCoords = texCoords;
                if(texSflipped||texTflipped){
                    if(texSflipped){
                        for(let i=0; i<this.texCoords.length; i+=2){
                            this.texCoords[i] = 1-this.texCoords[i]
                        }
                    }
                    if(texTflipped){
                        for(let i=0; i<this.texCoords.length; i+=2){
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
            let vd = vertices;
            if(texCoords instanceof Array && texCoords[0] instanceof Array){
                for(let i=0; i<texCoords; i++){
                    this.texCoords.push(texCoords[i][0],texCoords[i][1])
                }
            } else if (texCoords instanceof Array){
                this.texCoords = texCoords;
            } else {
                this.texCoords = []
            }
            if(indices.length >= 3){
            for(let i=0; i<indices.length/3; i++){
                let idx = [indices[i*3]*3,indices[i*3+1]*3,indices[i*3+2]*3]
                let triangle = [
                    [vd[idx[0]],vd[idx[0]+1],vd[idx[0]+2]],
                    [vd[idx[1]],vd[idx[1]+1],vd[idx[1]+2]],
                    [vd[idx[2]],vd[idx[2]+1],vd[idx[2]+2]]
                ]
                let normal = CORE.math.triangle.getSurfaceNormal(...triangle)
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
        for(let i=0; i<this.texCoords.length; i+=2){
            this.texCoords[i] = 1-this.texCoords[i]
        }
    }
    /**
     * Flips the T(V) texture coordinate of the mesh
     */
    flipTCoordinate(){
        for(let i=0; i<this.texCoords.length; i+=2){
            this.texCoords[i+1] = 1-this.texCoords[i+1]
        }
    }
    addTag(tag){
        this.tags.push(tag);
    }
    removeTag(){
        this.tag = undefined;
    }
    /**
     * Scales this mesh by vector
     * @param {Array<Number>} vector 
     */
    scale(vector){
        this.transform.scale = CORE.math.vec3.add(this.transform.scale,vector);
        this.transform.transformStayedSame = false;
    }
    /**
     * Sets the scale of this mesh
     * @param {Array<Number>} vector 
     */
    setScale(vector){
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
        this.transform.transformStayedSame = false;
    }
    /**
     * 
     * @param {Array<Number>} vector 
     */
    translate(vector){
        this.transform.position = CORE.math.vec3.add(vector,this.transform.position)
        this.transform.transformStayedSame = false;
    }
    /**
     * Sets the position of this mesh
     * @param {Array<Number>} vector 
     */
    setPosition(vector){
        this.transform.position = vector;
        this.transform.transformStayedSame = false;
    }
    /**
     * Sets the material of this mesh
     * @param {Material} material 
     */
    setMaterial(material){
        this.material = material;
    }
    /**
     * Reintializes buffers
     */
    rebuildBuffers(){
        this.buffers.built = false
    }
    /**
     * Generate a transformation matrix based on the mesh's transform.
     */
    generateTransformMatrix(){
        if(!this.transformStayedSame){
            let matrix = new Mat4();
            matrix.scale(this.transform.scale)
            matrix.rotate(this.transform.rotation.euler)
            matrix.translate(this.transform.position)
            this.transform.transformMatrix = matrix;
            this.transform.transformStayedSame = true;
            let normalMatrix = new Mat4()
            normalMatrix.set(matrix)
            normalMatrix.invert()
            normalMatrix.transpose()
            this.transform.normalMatrix = normalMatrix;
        }
    }
    retrieveUses(renderer){
        const buffers = []
        const attr = this.material.config.uses;
        for(const depends in attr){
            switch(parseInt(depends)){
                case CORE.enum.POSITION_BUFFER:{
                    const buffer = new ShaderInput(renderer,this.vertices,PositionBuffer,CORE.enum.ATTRIBUTE,[attr[depends]]);
                    buffers.push(buffer);
                    break;
                }
                case CORE.enum.NORMALS_BUFFER:{
                    const buffer = new ShaderInput(renderer,this.normals,PositionBuffer,CORE.enum.ATTRIBUTE,[attr[depends]]);
                    buffers.push(buffer);
                    break;
                }
                case CORE.enum.WORLD_TRANSFORM_MATRIX:{
                    const buffer = new ShaderInput(renderer,this.transform.transformMatrix,Uniform4x4Matrix,CORE.enum.UNIFORM,[attr[depends]]);
                    buffers.push(buffer);
                    break;
                }
                
            }
        }
        return buffers;
    }
    /**
     * Converts this mesh into a package to be rendered.
     * @param {Renderer} renderer 
     * @param {Mat4} viewMatrix 
     * @param {Mat4} projectionMatrix 
     * @param {Array} otherthings I legit have no idea what this does lmao
     * @param {Scene} scene 
     * @returns 
     */
    convertToPackage(renderer,viewMatrix,projectionMatrix,otherthings,scene){
        const rebuild = scene.built;
        if(rebuild){
            this.material.resetBuild();
        }
        this.generateTransformMatrix();
        let builtMaterial = this.material.build(renderer,scene,this);
        let materialData = builtMaterial.constructShaderDataList();
        let buffers = [new ShaderInput(renderer,this.indices,IndexBuffer,CORE.enum.NON_ATTRIBUTE)];
        for(const key in materialData){
            buffers.push(key);
        }
        
        buffers = buffers.concat(this.retrieveUses(renderer))
        buffers = buffers.concat(scene.retrieveUses(this.material.config.uses))
        console.log(builtMaterial)
        const renderpackage = new RenderablePackage(builtMaterial.shaderProgram,buffers,CORE.enum.ELEMENTS,CORE.enum,{
            numElements:this.indices.length,
            offset:0
        })
        return renderpackage;
    }
    /**
     * If a point/mesh intersects this mesh
     * @param {Mesh|Array<Number>}
     */
    intersects(b){
        if(b instanceof Array){
            nOfIntersec
        }
    }
}