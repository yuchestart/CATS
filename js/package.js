import { CATS } from "./core.js"
export class RenderablePackage{
    constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params){
        this.shaderProgram = shaderProgram;
        this.bufferList = [];
        this.uniformList = [];
        for(var i=0; i<shaderInputs.length; i++){
            if(shaderInputs[i].tag === CATS.enum.UNIFORM){
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