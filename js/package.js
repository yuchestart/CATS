import { CORE } from "./core.js"
export class RenderablePackage{
    constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params){
        this.shaderProgram = shaderProgram;
        this.bufferList = [];
        console.log(shaderInputs)
        this.uniformList = [];
        for(let i in shaderInputs){
            if(!(shaderInputs[i] instanceof ShaderInput))
                continue;
            let constructed = shaderInputs[i].convert()
            if(shaderInputs[i].type === CORE.enum.UNIFORM){
                this.uniformList.push(constructed)
            } else if (shaderInputs[i].type === CORE.enum.NON_ATTRIBUTE || shaderInputs[i].type===CORE.enum.ATTRIBUTE){
                this.bufferList.push(constructed)
            }
        }
        console.log(this.bufferList)
        this.drawingMethod = drawingMethod;
        this.renderType = renderType;
        this.params = params;
    }
}

export class ShaderInput{
    constructor(renderer,data,construct,type,params){
        this.renderer = renderer;
        this.data = data;
        this.construct = construct;
        this.type = type;
        this.params = params;
    }
    convert(){
        console.log(this.params)
        return new this.construct(this.renderer,this.data,...(this.params?this.params:[]))
    }
}