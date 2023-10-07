import { RenderablePackage } from "./package.js";
import {CORE} from "./core.js"
export class Renderer{
    //The actual rendering code, scene code will follow this.
    /**
     * Create a new Renderer object.
     * This Renderer object will do all the rendering, but you don't need to tweak around with it as
     * it's handled internally.
     * @param {HTMLCanvasElement} canvas 
     * @param {Boolean} disableDepthTest
     * @param {Boolean} disableCullFace
     * @param {Boolean} disableAutoAdjustAspectRatio
     * @param {Boolean} disableAlphaBlend
     */
    constructor(canvas,disableDepthTest,disableCullFace,disableAutoAdjustAspectRatio,disableAlphaBlend){
        //Initialization function
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");
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
        if(!disableDepthTest){
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL); // Change this to gl.LESS when adding cubemaps
        }
        if(!disableCullFace)
            this.gl.enable(this.gl.CULL_FACE);
        if(!disableAlphaBlend){
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA)
        }
        this.aspect = canvas.clientWidth/canvas.clientHeight;
        this.prevCanvasDimensions = {
            width:canvas.clientWidth,
            height:canvas.clientHeight
        }
        if(!disableAutoAdjustAspectRatio){
            this.autoAdjust = true;
        } else {
            this.autoAdjust = false;
        }
    }
    
    updateAspectRatio(){
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
        if(this.autoAdjust){
            this.updateAspectRatio()
        }
        var renderTypes = {
            0:this.gl.TRIANGLE_STRIP,
            1:this.gl.TRIANGLES,
            2:this.gl.POINTS,
            3:this.gl.LINES
        }
        var renderType;
        var program = renderPackage.shaderProgram.program;
        if(!renderPackage.renderType){
            renderType = renderTypes[1]
        } else {
            renderType = renderTypes[renderPackage.renderType]
        }
        //renderType = renderTypes[2]
        var buffers = renderPackage.bufferList;
        for(var i=0; i<buffers.length;i++){
            buffers[i].enableForProgram(program)
        }
        this.gl.useProgram(program);
        if(renderPackage.uniformList){
            var uniforms = renderPackage.uniformList
            for(var i=0; i<uniforms.length;i++){
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
