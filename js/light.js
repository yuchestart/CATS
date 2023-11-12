import { CORE } from "./core.js"
export class DirectionalLight{
    /**
     * A directional light effective to all objects.
     * @param {Array<Number>} direction Direction in angles. Directions are ordered X,Y
     * @param {Array<Number>|String} color Color of light. Default is white.
     * @param {Number} intensity Intensity of light
     */
    constructor(direction,intensity,color){
        this.direction = this.computeDirection(direction);
        if(color){
        this.color = CORE.Color(color).slice(0,3);
        } else {
            this.color = [1,1,1]
        }
        this.intensity = intensity;
    }
    computeDirection(dir){
        var v = [0,-1,0]
        var sin = Math.sin(CORE.math.toRadians(dir[0])), cos = Math.cos(CORE.math.toRadians(dir[0]))
        var a=v[1],b=v[2]
        v[1] = a*cos - b*sin;
        v[2] = a*sin + b*cos;
        sin = Math.sin(CORE.math.toRadians(dir[1])), cos = Math.cos(CORE.math.toRadians(dir[1]))
        a=v[0],b=v[2]
        v[0] = a*cos - b*sin;
        v[2] = a*sin + b*cos;
        return v;
    }
    changeDirection(dir){
        this.direction = this.computeDirection(dir);
    }
    changeIntensity(i){
        this.intensity = i;
    }
    changeColor(c){
        this.color = CORE.Color(c).slice(0,3);
    }
    convertToData(){
        return {
            divector:[...CORE.math.vec3.invert(this.direction),this.intensity],
            color:this.color,
            type:CORE.enum.DIRECTIONAL_LIGHT
        }
    }
}
export class AmbientLight{
    /**
     * An ambient light effective to all objects.
     * 
     */
    constructor(intensity,color){
        this.intensity = intensity/100;
        this.color = color?CORE.Color(color).slice(0,3):[1,1,1];
    }
    convertToData(){
        return {
            vec:[...this.color,this.intensity],
            type:CORE.enum.AMBIENT_LIGHT
        }
    }
}
export class PointLight{
    /**
     * A light that emits from a single point in all directions.
     * @param {Array<Number>} position The position of the point light
     * @param {Number} intensity The intensity of light - how bright is it
     * @param {Number} range The range of light - how far away can it go
     * @param {Array<Number>|String} color - The color of the light
     * @param {Array<Number>|String} specularColor - The color of the specular highlight
     */
    constructor(position,intensity,range,color,specularColor){
        this.position = position;
        this.color = color?CORE.Color(color).slice(0,3):[1,1,1];
        this.specularColor = specularColor?CORE.Color(specularColor).slice(0,3):[1,1,1];
        this.intensity = intensity?intensity:1;
        this.range = range?range:2;
    }
    translate(v){
        this.position = CORE.math.vec3.add(this.position,v)
    }
    convertToData(){
        return {
            pivector:[...this.position,this.intensity],
            color:[...this.color,this.range==1?1.0001:this.range],
            specularColor:[...this.specularColor],
            type:CORE.enum.POINT_LIGHT
        }
    }
}
export class SpotLight{
    /**
     * A light that lights up a cone shaped area.
     * @param {Array<Number>} position
     */
    constructor(position,direction,limit,intensity,range,color,specularColor){
        this.position = position;
        this.direction = direction;
        this.color = color?CORE.Color(color).slice(0,3):[1,1,1];
        this.specularColor = specularColor?CORE.Color.slice(0,3):[1,1,1];
        this.limit = limit;
        this.intensity = intensity?intensity:1;
        this.range = range?range:2;
    }
    translate(v){
        this.position = CORE.math.vec3.add(this.position,v)
    }
    convertToData(){
        return {
            sivector:[...this.position,this.intensity],
            color:[...this.color,this.range==1?1.0001:this.range],
            specularColor:[...this.specularColor],
            direction:[...this.direction,this.limit],
            type:CORE.enum.SPOT_LIGHT
        }
    }
}
