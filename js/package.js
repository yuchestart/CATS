import { CORE } from "./core.js"
export class RenderablePackage{
    constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params){
        this.shaderProgram = shaderProgram;
        this.bufferList = [];
        this.uniformList = [];
        for(let i=0; i<shaderInputs.length; i++){
            if(shaderInputs[i].tag === CORE.enum.UNIFORM){
                this.uniformList.push(shaderInputs[i])
            } else if (!shaderInputs[i].tag){
                this.bufferList.push(shaderInputs[i])
            }
        }
        
        this.drawingMethod = drawingMethod;
        this.renderType = renderType;
        this.params = params;
    }
}