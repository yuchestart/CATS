import { CORE } from "./core.js";

export class Armature{
    /**
     * An armature that a mesh can be deformed with
     * @param {Mesh} mesh The mesh to assign bones to
     */
    constructor(mesh){
        this.mesh = mesh
        this.bones = []
    }
    /**
     * Add bones
     * @param {Bone|Array<Bone>} bones
     */
    addBones(bones){
        if(bones instanceof Array){
            this.bones = this.bones.concat(bones)
        } else {
            this.bones.push(bones)
        }
    }
    calculateWeights(){

    }
    applyToMesh(){

    }
}
export class Bone{
    /**
     * Create a new bone
     */
    constructor(){
        this.position = [0,0,0];
        this.rotation = {
            euler:[0,0,0],
            quaternion:new Quaternion(0,0,0,1)
        };
        this.weights = []
    }
}