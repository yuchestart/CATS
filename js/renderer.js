import { RenderablePackage } from "./package.js";
import {CORE} from "./core.js"
export class Renderer{
    //The actual rendering code, scene code will follow this.
    /**
     * Create a new Renderer object.
     * This Renderer object will do all the rendering, but you don't need to tweak around with it as
     * it's handled internally.
     * @param {HTMLCanvasElement} canvas 
     * @param {Array<Number>} settings
     */
    constructor(canvas,settings=[]){
        //Initialization function
        this.canvas = canvas;
        this.gl = null;
        this.aspect = canvas.clientWidth/canvas.clientHeight;
        this.prevCanvasDimensions = {
            width:canvas.clientWidth,
            height:canvas.clientHeight
        }
        this.config = {
            depthTest:!(CORE.enum.DISABLE_DEPTH_TEST in settings),
            cullFace:!(CORE.enum.DISABLE_CULL_FACE in settings),
            autoAdjustAspectRatio:!(CORE.enum.DISABLE_AUTO_ADJUST_ASPECT_RATIO in settings),
            alphaBlend:!(CORE.enum.DISABLE_ALPHA_BLEND in settings)
        }
        this.createContext();
    }
    createContext(){
        console.log(this.config)
        this.gl = this.canvas.getContext("webgl2");
        if(this.gl===null){
            console.warn("WebGL2 Not supported, falling back to WebGL1.\nSome features may break.");
            this.gl = canvas.getContext("webgl")
            if(this.gl===null){
                console.warn("WebGL1 Not supported, falling back to experimental WebGL.\nSome features may break. We recommend using an up-to-date browser.");
                this.gl = canvas.getcontext("experimental-webgl")
                if(this.gl===null){
                    throw new Error("WebGL is not supported. Please use a different browser.");
                }
            }
        }
        if(this.config.depthTest){
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }
        
        if(this.config.cullFace)
            this.gl.enable(this.gl.CULL_FACE);
        this.autoAdjust = !!this.config.autoAdjustAspectRatio;
    }
    setDepthFunction(){

    }
    replaceContext(){
        if(this.gl.isContextLost()){
            this.createContext();
            console.warn("WebGL Context has been lost.")
        }
    }
    updateAspectRatio(){
        this.replaceContext()
        if(this.autoAdjust){
            this.aspect = this.canvas.clientWidth/this.canvas.clientHeight;
            this.prevCanvasDimensions = {
                width:this.canvas.clientWidth,
                height:this.canvas.clientHeight
            }
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.gl.viewport(0,0,this.canvas.width,this.canvas.height)
        }
    }
    /**
     * Clears the rendering surface
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    clear(r,g,b,a){
        this.replaceContext()
        //Clear rendering surface
        this.gl.clearColor(r,g,b,a);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    }
    /**
     * Draws an inputted renderable data package
     * Used INTERNALLY by CATS.
     * @param {RenderablePackage} package The package to draw.
     */
    drawPackage(renderPackage){
        this.replaceContext()
        if(this.autoAdjust){
            this.updateAspectRatio()
        }
        let renderTypes = {}
        renderTypes[CORE.enum.TRIANGLE_STRIP] = this.gl.TRIANGLE_STRIP;
        renderTypes[CORE.enum.TRIANGLES] = this.gl.TRIANGLE_STRIP;
        renderTypes[CORE.enum.POINT_CLOUD] = this.gl.POINTS;
        renderTypes[CORE.enum.LINES] = this.gl.LINES;
        let renderType;
        let program = renderPackage.shaderProgram.program;
        if(!renderPackage.renderType){
            renderType = renderTypes[1]
        } else {
            renderType = renderTypes[renderPackage.renderType]
        }
        //renderType = renderTypes[2]
        let buffers = renderPackage.bufferList;
        for(let i=0; i<buffers.length;i++){
            buffers[i].enableForProgram(program)
        }
        this.gl.useProgram(program);
        if(renderPackage.uniformList){
            let uniforms = renderPackage.uniformList
            for(let i=0; i<uniforms.length;i++){
                uniforms[i].enableForProgram(program)
            }
        }
        switch(renderPackage.drawingMethod){
            case CORE.enum.ELEMENTS:
                this.gl.drawElements(renderType,renderPackage.params.numElements,this.gl.UNSIGNED_SHORT,renderPackage.params.offset);
                break;
            case CORE.enum.ARRAYS:
                this.gl.drawArrays(renderType,0,renderPackage.params.numElements)
                break;
        }
    }
}
