//MAIN FILE OF THE LIBRARY

/**
 * 
 * EXTERNAL DEPENDENCIES:
 * glmatrix/mat4.js
 * 
 * WebGL Library Build 1.0.102
 */
//-----------OTHER CODE-----------
//#region 
function print(m){
    console.log(m)
}
//#endregion
//-----------RENDERER OBJECT-----------
//The object that the user will initiate at the start
//#region 
class Renderer{
    //The actual rendering code, scene code will follow this.
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas){
        //Initialization function
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2")
        if(this.gl===null){
            console.warn("WebGL2 Not supported, falling back to WebGL1");
            this.gl = canvas.getContext("webgl")
            if(this.gl===null){
                console.warn("WebGL Not supported, falling back to experimental WebGL");
                this.gl = canvas.getcontext("experimental-webgl")
                if(this.gl===null){
                    console.error("Experimental WebGL not supported.");
                    return;
                }
            }
        }
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL)
        this.aspect = canvas.clientWidth/canvas.clientHeight;
    }
    /**
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    clear(r,g,b,a){
        //Clear rendering surface
        this.gl.clearColor(r,g,b,a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearDepth(1.0);
    }
    /**
     * 
     * @param {ShaderProgram} program 
     * @param {BufferList} buffers 
     * @param {*} projectionMatrix 
     * @param {*} viewMatrix 
     * @param {*} worldMatrix 
     */
    drawProgram(program,buffers,projectionMatrix,viewMatrix,worldMatrix){
        for(var i=0; i<buffers.length;i++){
            buffers.buffers[i].enableForProgram(buffers.bufferNames[i])
        }
    }
    //Development reset :(
}
//#endregion
//-----------SCENE-----------
//Scene code will be developed after basic rendering functions have been finished
//#region
class Scene{
    /**
     * Create a new scene
     * @param {Renderer} renderer 
     * 
     */
    constructor(renderer){
        this.renderer = renderer;
        this.gl = renderer.gl;
        this.sceneObjects = [];
    }
    addObjectToScene(object){
        this.sceneObjects.push(object);
    }
    renderScene(){

    }
}
//SCENE OBJECTS

class SceneObject{
    constructor(type,hidden,vertexData){
        this.type = type;
        this.hidden = hidden;
        this.vertexData = vertexData;
    }
}
//#endregion
//-----------SHADERS AND BUFFERS-----------
//Part of the basic rendering code
//#region
class VertexShader{
    /**
     * 
     * @param {String} source 
     * @param {Object} attributeData 
     */
    constructor(source,attributeData){
        this.source = source.replaceAll(/\n|\r|\t/gi," ");
        this.attributeData = attributeData;
        this.usage = usage;
    }
    compile(renderer){
        const gl = renderer.gl
        const shader = gl.createShader(renderer.gl.VERTEX_SHADER);
        gl.shaderSource(shader,this.source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            console.error(`An error occurred while compiling the vertex shader: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}

class FragmentShader{
    /**
     * 
     * @param {String} source 
     * @param {Object} attributeData 
     */
    constructor(source,attributeData){
        this.source = source.replaceAll(/\n|\r|\t/gi," ");
        this.attributeData = attributeData;
        this.usage = usage;
    }
    compile(renderer){
        const gl = renderer.gl
        const shader = gl.createShader(renderer.gl.FRAGMENT_SHADER);
        gl.shaderSource(shader,this.source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            console.error(`An error occurred while compiling the fragment shader: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}
class ShaderProgram{
    /**
     * 
     * @param {Renderer} renderer 
     * @param {VertexShader} vshader 
     * @param {FragmentShader} fshader 
     * @returns 
     */
    constructor(renderer,vshader,fshader){
        const gl = renderer.gl;
        const vertexShader = vshader.compile(renderer);
        const fragmentShader = fshader.compile(renderer);
        const program = gl.createProgram();
        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
            console.error(`An error occurred while initializing the program: ${gl.getProgramInfoLog(program)}`);
            return null;
        }
        this.program = program;
        this.vertexShaderAttributes = vertexShader.attributeData;
        var newthing = {}
        for(var i=0; i<this.vertexShaderAttributes.attributes.length;i++){
            newthing[this.vertexShaderAttributes.attributes[i]] = gl.getAttribLocation(program,this.vertexShaderAttributes.attributes[i]);
        }
        this.vertexShaderAttributes.attributes = newthing;
        var newthing = {}
        for(var i=0; i<this.vertexShaderAttributes.uniforms.length;i++){
            newthing[this.vertexShaderAttributes.uniforms[i]] = gl.getAttribLocation(program,this.vertexShaderAttributes.uniforms[i]);
        }
        this.vertexShaderAttributes.uniforms = newthing;
        this.fragmentShaderAttributes = fragmentShader.attributeData;
    }
}
class Buffer{
    /**
     * 
     * @param {Renderer} render 
     * @param {Array} data 
     * @param {Number} usage 
     * @param {Number} type
     */
    constructor(render,data,usage,type){
        this.render = render;
        this.data = data;
        this.usage = usage;
        const gl = render.gl;
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,newBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),usage?usage:gl.STATIC_DRAW);
        this.buffer = newBuffer;
        this.type = type;
    }
    /**
     * 
     * @param {Number} numComponentsPerIteration 
     * @param {Number} type 
     * @param {Number} normalize 
     * @param {Number} stride 
     * @param {Number} offset 
     */
    enableForProgram(attribute,numComponentsPerIteration,type,normalize,stride,offset){
        if(this.type == glDictionary.ATTRIBUTE){
            this.render.gl.bindBuffer(this.render.gl.ARRAY_BUFFER,this.buffer);
            this.render.gl.vertexAttribPointer(
                attribute,
                numComponentsPerIteration,
                type,
                normalize,
                stride,
                offset
            )
            this.render.gl.enableVertexAttribArray(attribute);
        } else {
            
        }
    }
}
//Bruh this part is pretty useless but I'll include it anyway. ;)
class BufferList{
    /**
     * 
     * @param {Array} bufferNames 
     * @param {Array<Buffer>} buffers 
     */
    constructor(bufferNames,buffers){
        this.bufferNames = bufferNames;
        this.buffers = buffers;
        this.length = buffers.length;
    }
}
//#endregion