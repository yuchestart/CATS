import { Curve } from "./math";
import { Mesh } from "./mesh";
import { Cube } from "./primitives";

export class CPUParticleEmitter{
    /**
     * This object creates a new CPU based particle emitter
     * @param {Mesh} mesh The mesh that composes the particles.
     * @param {Mesh} emissionMesh The shape that the particles are emitted in
     * @param {Number} frequency How frequently particles are emitted. UNIT: particles/second
     * @param {Number} lifetime How long each particle lasts. UNIT: seconds
     */
    constructor(mesh,emissionMesh=new Cube(1),frequency,lifetime,){
        this.mesh = mesh;
        this.emission = emissionMesh;
        this.frequency = frequency;
        this.maxParticles = frequency*lifetime;
        this.particles = [];
        this.prevTime = null;
        this.enabled = false;
    }
    startParticles(){
        this.enabled = true;
        this.prevTime = new Date().getTime()
    }
    updateParticles(){
        const deltaTime = prevTime
        for(var i=0; i<this.particles.length; i++){
            
        }
    }
}
export class Particle{
    /**
     * 
     * @param {Mesh} mesh 
     * @param {Array<Number>} position 
     * @param {Array<Number>} rotation 
     * @param {Number|Array<Number>} scale 
     * @param {Curve} posUpdate 
     * @param {Curve} rotUpdate
     * @param {Curve} scaleUpdate
     */
    constructor(mesh,position,rotation,scale,lifetime,posUpdate,rotUpdate,scaleUpdate){
        this.mesh = mesh;
        this.mesh.setPosition(position);
        this.mesh.setRotation(rotation);
        if(typeof scale == "number"){
            this.mesh.setScale([scale,scale,scale])
        } else if(scale instanceof Array){
            this.mesh.setScale(scale);
        }
        this.velocity = velocity;
        this.lifetime = lifetime;
        this.progression = 0;
    }
    update(){
        progression+=1;

    }
}