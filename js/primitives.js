import { Material } from "./material.js";
import { Mesh } from "./mesh.js"

export class Cube extends Mesh{
    /**
     * An object with 8 vertices and 6 faces.
     * Resembles a box.
     * @param {Number} size The size of the cube.
     * @param {Material} material The material of the cube.
     */
    constructor(size,material,customTextureCoordinates){
        size *= 0.5
        super([
            //Back
            -size,size,-size,
            size,size,-size,
            -size,-size,-size,
            size,-size,-size,
            //Front
            -size,size,size,
            size,size,size,
            -size,-size,size,
            size,-size,size,
            //Left
            -size,size,size,
            -size,size,-size,
            -size,-size,size,
            -size,-size,-size,
            //Right
            size,-size,size,
            size,-size,-size,
            size,size,size,
            size,size,-size,
            //Top
            -size,size,size,
            size,size,size,
            -size,size,-size,
            size,size,-size,
            //Bottom
            -size,-size,-size,
            size,-size,-size,
            -size,-size,size,
            size,-size,size,
            
        ],[
            3,2,0,
            0,1,3,
            4,6,7,
            7,5,4,
            11,10,8,
            8,9,11,
            15,14,12,
            12,13,15,
            17,19,16,
            19,18,16,
            21,23,20,
            23,22,20
        ],material,0,0,customTextureCoordinates?customTextureCoordinates:[
            
        ],1)
    }
}
export class Sphere extends Mesh{
    /**
     * A circular object resembling a ball.
     * @param {Number} radius The radius of the sphere
     * @param {Number} div The division of the sphere, higher the smoother
     * @param {Material} material The material applied to the sphere
     */
    constructor(radius,div,material){
        radius *= 0.5
        var points = [],indices = [];
        for(var j=0; j<=div; j++){
            var anglej = j*Math.PI / div;
            var sinj = Math.sin(anglej);
            var cosj = Math.cos(anglej);
            for(var i=0; i<=div; i++){
                var anglei=i*2*Math.PI/div;
                var sini = Math.sin(anglei);
                var cosi = Math.cos(anglei);
                points.push(radius*sini*sinj);
                points.push(radius*cosj);
                points.push(radius*cosi*sinj);
            }
        }
        for(var j=0; j<div;j++){
            for(var i=0; i<div; i++){
                var point1 = j*(div+1)+i;
                var point2 = point1 + (div+1);
                indices.push(point1);
                indices.push(point2);
                indices.push(point1+1);
                indices.push(point1 + 1);
                indices.push(point2);
                indices.push(point2+1);
            }
        }
        super(points,indices,material)
    }
}
export class Plane extends Mesh{
    /**
     * A flat object resembling a square.
     * @param {Number} size The size of the plane.
     * @param {Material} material The material applied to the plane.
     */
    constructor(size,material){
        size*=0.5
        var vertices = [
            size,0,size,
            -size,0,size,
            -size,0,-size,
            size,0,-size           
        ];
        var indices = [
            0,1,3,
            1,2,3,
        ]
        super(vertices,indices,material,true,[
            0,-1,0,
            0,-1,0,
            0,-1,0,
            0,-1,0,
        ])
    }
}
export class Vector3Mesh extends Mesh{
    /**
     * An easy way to visualize a Vector3.
     * Good for debugging applications
     * @param {Array} position 
     * @param {Array} vector 
     */
    constructor(position,vector,material){
        super([
            0,0,0,
            vector[0],vector[1],vector[2]
        ],[
            0,1,0
        ],material,false,);
        this.translate(position);
    }
}
