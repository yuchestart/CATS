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
        this.gl.useProgram(renderPackage.program);
        log(renderPackage)
        var renderTypes = [this.gl.TRIANGLE_STRIP,this.gl.TRIANGLES,this.gl.POINTS]
        if(!renderType){
            renderType = this.gl.TRIANGLES;
        } else {
            renderType = renderTypes[renderType]
        }
        if(renderPackage.uniformList){
            var uniforms = renderPackage.uniformList
            for(var i=0; i<uniforms.length;i++){
                uniforms[i].enableForProgram(renderPackage.program)
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
//-----MAIN SCENE-----
//#region 
class Camera{
    constructor(pos,facingDirection,fov,near,far){
        this.pos = pos;
        //Contains XYZ rotations
        this.facingDirection = facingDirection?facingDirection:[0,0,0];
        this.fov = fov;
        this.near = near;
        this.far = far;
    }
    project(aspect){
        var projectionMatrix = new Mat4();
        var viewMatrix = new Mat4();
        var rotationMatrix = new Mat4();
        rotationMatrix.rotate(this.facingDirection[0],[0,0,1]);
        rotationMatrix.rotate(this.facingDirection[1],[0,1,0]);
        rotationMatrix.rotate(this.facingDirection[2],[1,0,0]);
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
            this.bgcolor =this.bgcolor.replace("#","")
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
    clear(){
        this.renderer.clear(...this.bgcolor);
    }
    render(dontclear){
        if(!dontclear){
            this.renderer.clear(...this.bgcolor)
        }
        for(var i=0; i<this.sceneObjects.length; i++){
            var renderpackage = this.sceneObjects[i].package(this.renderer);
            var cameraMatrixes = this.camera.project(this.renderer.aspect);
            renderpackage.uniformList.push(cameraMatrixes.prj.convertToUniform(this.renderer,"pM"));
            renderpackage.uniformList.push(cameraMatrixes.v.convertToUniform(this.renderer,"cM"))
            this.renderer.drawPackage(renderpackage,glDictionary.ELEMENTS)
        }
    }
    translateCamera(v){
        this.camera.pos = vec3.add(this.camera.pos,v);
    }
    rotateCamera(v){
        
    }
}
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
    }
    package(renderer,uniforms){
        var currentbufferlist = [
            new Buffer(renderer,this.vertexData,"vP",null,glDictionary.ATTRIBUTE,[
                3,
                renderer.gl.FLOAT,
                false,
                0,0
            ]),
            new Buffer(renderer,this.indexData,"",null,render.gl.ELEMENT_ARRAY_BUFFER,glDictionary.NONATTRIBUTE,0,0,Uint16Array)
        ];
        var currentuniformlist = uniforms;
        var compiledmaterial = this.material.compile(renderer);
        currentbufferlist.push(...compiledmaterial.buffers);
        currentuniformlist.push(...compiledmaterial.uniforms);
        var newRenderPackage = new RenderablePackage(
            this.material.program,
            this.vertices,
            glDictionary.ELEMENTS,
            this.material.buffers,
            uniforms,
            0,
            true,
            this.indexData.length
        );
        return newRenderPackage;
    }
}
//#endregion
//-----MATERIALS-----
//#region 
class SingleColorMaterial{
    /**
     * 
     * @param {String} color 
     */
    constructor(color){
        this.vertexShader = new VertexShader(`
attribute vec3 vP;
uniform mat4 pM;
uniform mat4 vM;
uniform mat4 tM;
void main(void){
    gl_Position = pM*vM*tM*vec4(vP,1.0);
}
`,{
    attributes:['vP'],
    uniforms:["pM","vM","tM"]
});
        this.fragmentShader = new FragmentShader(`
void main(void){
    gl_FragColor = vec4(${color});
}
`);
        this.color = color;
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    compile(renderer){
        var program = new ShaderProgram(renderer,this.vertexShader,this.fragmentShader);
        var buffers = [];
        var uniforms = [];
        return {
            program:program,
            buffers:buffers,
            uniforms:uniforms
        }
    }
}
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
        console.log(shader);
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
        this.parameterLocations = {
            attributes:{},
            uniforms:{},
        }
        var newthing = {
            attributes:[],
            uniforms:[]
        }
        for(var i=0; i<vertexShader.attributeData.attributes.length;i++){
            newthing.attributes[vertexShader.attributeData.attributes[i]] = gl.getAttribLocation(program,vertexShader.attributeData.attributes[i]);
        }
        for(var i=0; i<vertexShader.attributeData.uniforms.length;i++){
            newthing.uniforms[vertexShader.attributeData.uniforms[i]] = gl.getUniformLocation(program,vertexShader.attributeDaa.uniforms[i]);
        }
        for(var i=0; i<fragmentShader.attributeData.uniforms.length;)
        this.fragmentShaderAttributes = fragmentShader.attributeData;
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
