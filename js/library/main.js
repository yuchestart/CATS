//MAIN FILE OF THE LIBRARY

/**
 * 
 * EXTERNAL DEPENDENCIES:
 * glmatrix/mat4.js - to be replaced with WebGLLibrary/mat4.js
 * 
 * WebGL Library
 * 
 * (C) 2022-2023 Che Yu
 * This code is open sourced and free to use so do anything you like.
 */
//-----------MISC-----------
//#region 
function print(m){
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
            console.warn("WebGL2 Not supported, falling back to WebGL1");
            this.gl = canvas.getContext("webgl")
            if(this.gl===null){
                console.warn("WebGL1 Not supported, falling back to experimental WebGL");
                this.gl = canvas.getcontext("experimental-webgl")
                if(this.gl===null){
                    console.error("WebGL at a whole is not supported");
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
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    }
    /**
     * Draws a shader program object.
     * 
     * NOTE:
     * drawProgram is deprecated. Use drawPackage instead.
     * @param {ShaderProgram} program 
     * @param {BufferList} buffers 
     * @param {*} projectionMatrix 
     * @param {*} viewMatrix 
     * @param {*} worldMatrix 
     */
    drawProgram(program,buffers,uniforms,vertices,type,renderType,otherParameters){
        //Enable the buffers
        var renderTypes = [this.gl.TRIANGLE_STRIP,this.gl.TRIANGLES,this.gl.POINTS]
        if(!renderType){
            renderType = this.gl.TRIANGLES
        } else {
            renderType = renderTypes[renderType]
        }
        for(var i=0; i<buffers.length;i++){
            buffers.buffers[i].enableForProgram(buffers.bufferNames[i] )
        }
        this.gl.useProgram(program.program);
        for(var i=0; i<uniforms.length;i++){
            uniforms.uniforms[i].enableForProgram()
        }
        if(type==glDictionary.ELEMENTS){
            this.gl.drawElements(renderType,vertices,this.gl.UNSIGNED_SHORT,otherParameters.offset)
        } else if(type == glDictionary.ARRAYS){
            this.gl.drawArrays(renderType,0,vertices);
        }
    }
    /**
     * Draws a renderable data package.
     * @param {RenderablePackage} package 
     */
    drawPackage(renderPackage,renderType){
        this.gl.useProgram(renderPackage.program);
        var renderTypes = [this.gl.TRIANGLE_STRIP,this.gl.TRIANGLES,this.gl.POINTS]
        if(!renderType){
            renderType = this.gl.TRIANGLES;
        } else {
            renderType = renderTypes[renderType]
        }
        if(renderPackage.uniformList){
            var uniforms = renderPackage.uniformList
            for(var i=0; i<uniforms.length;i++){
                uniforms.uniforms[i].enableForProgram(renderPackage.program)
            }
        }
        var buffers = renderPackage.bufferList
        for(var i=0; i<buffers.length;i++){
            buffers.buffers[i].enableForProgram(buffers.bufferNames[i],renderPackage.program)
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

//The scene code is what the user will interact with for most of the time.
class Camera{
    constructor(pos,facingDirection,fov,near,far){
        this.pos = pos;
        //Contains XYZ rotations
        this.facingDirection = facingDirection?facingDirection:[0,0,1];
        this.fov = fov;
        this.near = near;
        this.far = far;
    }
    project(aspect){
        var projectionMatrix = new Mat4();
        var viewMatrix = new Mat4();
        projectionMatrix.perspective(this.fov,aspect,this.near,this.far);
        viewMatrix.lookAt(this.pos,this.facingDirection,[0,1,0]);
        return {
            prj:projectionMatrix,
            v:viewMatrix,
        }
    }

}
class Scene{
    /**
     * Create a new scene
     * @param {Renderer} renderer 
     * @param {String} bgcolor
     * @param {Camera} camera
     */
    constructor(renderer,camera,bgcolor){
        this.renderer = renderer;
        this.gl = renderer.gl;
        this.sceneObjects = [];
        this.bgcolor = bgcolor;
        if(this.bgcolor.startsWith("#")){
            var newcolor = [0,0,0,1.0]
            this.bgcolor.replace("#","")
            newcolor[0] = parseInt(this.bgcolor.slice(0,2),16)*(1/255);
            newcolor[1] = parseInt(this.bgcolor.slice(2,4),16)*(1/255);
            newcolor[2] = parseInt(this.bgcolor.slice(4,6),16)*(1/255);
            this.bgcolor = newcolor;
        } else if(this.bgcolor.startsWith("rgba")){
            var newcolor = [0,0,0,0]
            this.bgcolor.replace("rgba(","")
            this.bgcolor.replace(")","");
            this.bgcolor = this.bgcolor.split(",");
            for(var i=0; i<3; i++){
                newcolor[i] = parseInt(this.bgcolor[i])*(1/255);
            }
            newcolor[3] = parseFloat(this.bgcolor[i])
            this.bgcolor = newcolor;
        }
        this.camera = camera;
    }
    /**
     * 
     * @param {Mesh} object 
     */
    addObjectToScene(object){
        this.sceneObjects.push(object);
    }
    render(dontclear){
        if(!dontclear){
            render.clear(...this.bgcolor)
        }
        for(var i=0; i<this.sceneObjects.length; i++){
            var renderpackage = this.sceneObjects[i].package();
            renderpackage.uniformList.push()
        }
    }
    translateCamera(v){
        this.camera.pos = vec3.add(this.camera.pos,v);
    }
    rotateCamera(v){
        var rotationMatrix = new Mat4();
        rotationMatrix.rotate(v[0],[0,0,1]);
        rotationMatrix.rotate(v[1],[0,1,0]);
        rotationMatrix.rotate(v[2],[1,0,0]);
    }
}
//SCENE OBJECTS

class Mesh{
    /**
     * 
     * @param {Array} vertexData 
     * @param {Array} indexData 
     * @param {*} material 
     * @param {*} meshData 
     */
    constructor(vertexData,indexData,material,meshData){
        this.vertexData = vertexData;
        this.indexData = indexData;
        this.material = material;
        this.meshData = meshData;
        this.visible = true;
        this.transformationMatrix = new Mat4();
        this.position = [0,0,0]
    }
    hide(){
        this.visible = false;
    }
    show(){
        this.visible = true;
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    
    translate(x,y,z){
        //There is no need to store the transformations, as all of them will be a sum.
        this.position = vec3.add(this.position,[x,y,z]);
    }
    package(renderer,camera){
        this.transformationMatrix = new Mat4();
        const gl = renderer.gl;
        this.transformationMatrix.translate(this.position);
        var compiledMaterial = this.material.compile(renderer,this.vertexData,this.indexData);
        var transformationMatrix = this.transformationMatrix.convertToUniform(renderer,"tM",compiledMaterial.program)

        var renderpackage = new RenderablePackage(compiledMaterial.program,compiledMaterial.bufferList,vertexData.length/3,glDictionary.ELEMENTS,[transformationMatrix],0,true,indexData.length())
        return renderpackage;
    }
}

//Materials

class BasicColorMaterial{
    constructor(color,haslighting){
        //Tries to conserve as much space as possible
        this.vertexShader = new VertexShader(`
attribute vec3 vP;
attribute vec4 vC;
uniform mat4 pM;
uniform mat4 cM;
uniform mat4 tM;
varying lowp vec4 fC;
void main(void){
gl_Position = tM*cM*pM*vec4(vP);
fC = vC;
}
`,{
    attributes:["vP","vC"],
    uniforms:["pM","cM","tM"]
});
    this.fragmentShader = new FragmentShader(`
varying lowp vec4 fC;
void main(void){
    gl_FragColor = fC;
}
`);
    this.colorBufferData = color;
    this.haslighting = haslighting;
    }
    compile(renderer,vertexData,indexData){
        var shaderProgram = new ShaderProgram(renderer,this.vertexShader,this.fragmentShader);
        var positionBuffer = new Buffer(renderer,vertexData,null,glDictionary.ATTRIBUTE,[3,gl.FLOAT,false,0,0]);
        var indexBuffer = new Buffer(renderer,indexData,null,glDictionary.NONATTRIBUTE,[],gl.ELEMENT_ARRAY_BUFFER,Uint16Array);
        if(this.haslighting){
            //Lighting will be implemented after milestone 2! 
        } else {
            var colorBuffer = new Buffer(renderer)
            var bufferList = new BufferList(["vP","idx","vC"],[positionBuffer,indexBuffer,colorBuffer]);
        }
        return {
            program:shaderProgram,
            buffers:bufferList
        };
    }
}
//#endregion
//-----------SHADERS-----------
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
        this.vertexShaderAttributes = vshader.attributeData;
        var newthing = {}
        for(var i=0; i<this.vertexShaderAttributes.attributes.length;i++){
            newthing[this.vertexShaderAttributes.attributes[i]] = gl.getAttribLocation(program,this.vertexShaderAttributes.attributes[i]);
        }
        this.vertexShaderAttributes.attributes = newthing;
        var newthing = {}
        for(var i=0; i<this.vertexShaderAttributes.uniforms.length;i++){
            newthing[this.vertexShaderAttributes.uniforms[i]] = gl.getUniformLocation(program,this.vertexShaderAttributes.uniforms[i]);
        }
        this.vertexShaderAttributes.uniforms = newthing;
        this.fragmentShaderAttributes = fragmentShader.attributeData;
    }
}
//#endregion
//-----------BUFFERS-----------
//Also part of the basic rendering code
//Note: Color buffer for some reason fails

//#region

//Ugh, buffers are so annoying.
class Buffer{
    /**
     * 
     * @param {Renderer} render 
     * @param {Array} data 
     * @param {Number} usage 
     * @param {Number} type
     */
    constructor(render,data,usage,type,programData,usageType,dataType){
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
    }
    /**
     * 
     * @param {Number} numComponentsPerIteration 
     * @param {Number} type 
     * @param {Number} normalize 
     * @param {Number} stride 
     * @param {Number} offset 
     */
    enableForProgram(attribute,program){
        if(this.type == glDictionary.ATTRIBUTE){
            this.render.gl.bindBuffer(this.usageType,this.buffer);
            this.render.gl.vertexAttribPointer(
                this.render.gl.getAttribLocation(program,attribute),
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
//Apparently, matrixes aren't buffers so I have to include them here.
class UniformMAT4Matrix{
    constructor(render,matrix,attribute){
        this.matrix = matrix;
        this.attribute = attribute;
        this.render = render;
    }
    enableForProgram(program){
        this.render.gl.uniformMatrix4fv(this.render.gl.getUniformLocation(program,this.attribute),
        false,
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
//-----------PROGRAMS-----------
//Just compacts everything together for renderer to process.
//#region 
class RenderablePackage{
    constructor(shaderProgram,bufferList,vertices,renderType,uniformList,offset,usesIndexBuffer,indexAmount){
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