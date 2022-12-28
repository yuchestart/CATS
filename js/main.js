//MAIN FILE OF THE LIBRARY

/**
 * 
 * EXTERNAL DEPENDENCIES:
 * glmatrix/mat4.js - to be replaced with WebGLLibrary/math.js
 * 
 * WebGL Library
 * 
 */
//-----------MISC-----------
//#region 
/**
 * Prints a message
 * @param {*} m 
 */
function log(m){
    console.log(m)
}
//#endregion
//-----------RENDERER OBJECT-----------
//The object that the user will initiate at the start
//The user won't interact with this much
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
            console.warn("WebGL2 Not supported, falling back to WebGL1.\nSome features may break.");
            this.gl = canvas.getContext("webgl")
            if(this.gl===null){
                console.warn("WebGL1 Not supported, falling back to experimental WebGL.\nSome features may break. We recommend using an up-to-date browser.");
                this.gl = canvas.getcontext("experimental-webgl")
                //if(this.gl===null){
                //    throw new Error("WebGL at a whole is not supported. Please use a different browser.");
                //}
            }
        }
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
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
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    }
    /**
     * Draws a renderable data package.
     * @param {RenderablePackage} package 
     */
    drawPackage(renderPackage,renderType){
        log(renderPackage)
        var renderTypes = [this.gl.TRIANGLE_STRIP,this.gl.TRIANGLES,this.gl.POINTS]
        if(!renderType){
            renderType = this.gl.TRIANGLES;
        } else {
            renderType = renderTypes[renderType]
        }
        var buffers = renderPackage.bufferList
        for(var i=0; i<buffers.length;i++){
            buffers.buffers[i].enableForProgram(buffers.bufferNames[i],renderPackage.program)
        }
        this.gl.useProgram(renderPackage.program);
        if(renderPackage.uniformList){
            var uniforms = renderPackage.uniformList
            for(var i=0; i<uniforms.length;i++){
                uniforms[i].enableForProgram(renderPackage.program)
            }
        }
        switch(renderPackage.renderType){
            case glDictionary.ELEMENTS:
                this.gl.drawElements(renderType,renderPackage.indexAmount,this.gl.UNSIGNED_SHORT,renderPackage.offset);
                break;
            case glDictionary.ARRAYS:
                this.gl.drawArrays(renderType,0,renderPackage.vertices)
                break;
        }
    }
}
//#endregion
//-----------SCENE-----------
//Scene code will be developed after basic rendering functions have been finished
//#region
//-----MAIN SCENE-----
//#region 
//#endregion
//-----SCENE OBJECTS-----
//#region 
class Mesh{
    /**
     * 
     * @param {Array} vertexData 
     * @param {Array} indexData 
     * @param {ShaderProgram} program 
     */
    constructor(vertexData,indexData,material){
        this.vertexData = vertexData;
        this.indexData =indexData;
        this.material = material;
        this.position = [0,0,0];
    }
    translate(v){
        this.position = vec3.add(v,this.position)
    }
    render(){

    }
}
//#endregion
//-----MATERIALS-----
//#region 
//#endregion
//#endregion
//-----------SHADERS-----------
//Part of the basic rendering code
//#region
//-----Vertex and fragment shaders
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
        //this.usage = usage;
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
        //this.usage = usage;
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
//#endregion
//-----Shader program-----
//#region 
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
        this.parameterLocations = null;
        var newthing = {
            attributes:[],
            uniforms:[]
        }
        for(var i=0; i<vshader.attributeData.attributes.length;i++){
            newthing.attributes[vshader.attributeData.attributes[i]] = gl.getAttribLocation(program,vshader.attributeData.attributes[i]);
        }
        for(var i=0; i<vshader.attributeData.uniforms.length;i++){
            newthing.uniforms[vshader.attributeData.uniforms[i]] = gl.getUniformLocation(program,vshader.attributeData.uniforms[i]);
        }
        if(fshader.attributeData != undefined){
            for(var i=0; i<fshader.attributeData.uniforms.length;i++){
                newthing.uniforms[fshader.attributeData.uniforms[i]] = gl.getUniformLocation(program,fshader.attributeData.uniforms[i]);
            }
        }
        this.parameterLocations = newthing;
    }
}
//#endregion
//#endregion
//-----------BUFFERS AND UNIFORMS-----------
//Also part of the basic rendering code
//#region

//-----Buffers-----
//#region 
class Buffer{
    /**
     * 
     * @param {Renderer} render 
     * @param {Array} data 
     * @param {Number} usage 
     * @param {Number} type
     */
    constructor(render,data,attribute,usage,type,programData,usageType,dataType){
        if(!usageType){
            usageType = render.gl.ARRAY_BUFFER
        }
        this.render = render;
        this.data = data;
        this.usage = usage;
        this.usageType = usageType;
        const gl = render.gl;
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(usageType,newBuffer);
        gl.bufferData(usageType,dataType?new dataType(data):new Float32Array(data),usage?usage:gl.STATIC_DRAW);
        this.buffer = newBuffer;
        this.type = type;
        this.programData = programData;
        this.attribute = attribute;
    }
    /**
     * 
     * @param {ShaderProgram} program
     * 
     */
    enableForProgram(program){
        if(this.type == glDictionary.ATTRIBUTE){
            this.render.gl.bindBuffer(this.usageType,this.buffer);
            this.render.gl.vertexAttribPointer(
                this.render.gl.getAttribLocation(program.program,this.attribute),
                this.programData[0],
                this.programData[1],
                this.programData[2],
                this.programData[3],
                this.programData[4],
            )
            this.render.gl.enableVertexAttribArray(this.render.gl.getAttribLocation(program,attribute));
        } else if(this.type == glDictionary.NONATTRIBUTE){
            this.render.gl.bindBuffer(this.usageType,this.buffer)
        }
    }
}
//#endregion
//-----Uniforms-----
//#region 
//Apparently, uniforms aren't buffers so I have to include them here.
//Later I found out that there are multiple types of uniforms so I'm glad I named them like this
class UniformMAT4Matrix{
    constructor(render,matrix,attribute){
        this.matrix = matrix;
        this.attribute = attribute;
        this.render = render;
    }
    enableForProgram(program){
        this.render.gl.uniformMatrix4fv(this.render.gl.getUniformLocation(program,this.attribute),
        this.render.gl.FALSE,
        this.matrix)
    }
}
//This part is also useless but kinda useful...
class UniformList{
    /**
     * 
     * @param {Array<UniformMAT4Matrix>} uniforms 
     */
    constructor(uniforms){
        this.uniforms = uniforms;
        this.length = uniforms.length;
    }
}
//#endregion
//#endregion
//-----------PROGRAMS-----------
//Just compacts everything together for renderer to process.
//#region 
class RenderablePackage{
    /**
     * 
     * @param {ShaderProgram} shaderProgram 
     * @param {Array} bufferList 
     * @param {Array} vertices 
     * @param {Number} renderType 
     * @param {Array} uniformList 
     * @param {Number} offset 
     * @param {Boolean} usesIndexBuffer 
     * @param {Number} indexAmount 
     */
    constructor(shaderProgram,vertices,renderType,bufferList,uniformList,offset,usesIndexBuffer,indexAmount){
        this.shaderProgram = shaderProgram;
        this.program = shaderProgram.program;
        this.bufferList = bufferList;
        this.uniformList = uniformList;
        this.vertices = vertices;
        this.renderType = renderType;
        this.offset = offset;
        this.usesIndexBuffer = usesIndexBuffer;
        this.indexAmount = indexAmount;
    }
}
//#endregion
