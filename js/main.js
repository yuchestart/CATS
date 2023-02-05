//MAIN FILE OF THE LIBRARY

/**
 * What-ever-this-is's WebGL Library
 * 
 * Created by Che Yu.
 * 
 * Now that's a lot of code.
 */
//-----------MISC-----------
//#region 
/**
 * Some random code
 */
const glLibrary = {
    rgba2rgb:function(r,g,b,a){
        return [r*this.oneOver255,g*this.oneOver255,b*this.oneOver255,a]
    },
    hex2rgb:function(hex,stringify){
        hex = hex.slice(1);
        newcolor = [0,0,0,1.0];
        newcolor[0] = parseInt(hex.slice(0,2),16)*this.oneOver255;
        newcolor[1] = parseInt(hex.slice(2,4),16)*this.oneOver255;
        newcolor[2] = parseInt(hex.slice(4,6),16)*this.oneOver255;
        return stringify?newcolor.toString():newcolor;
    },
    oneOver255:1/255
}
Object.freeze(glLibrary)
//#endregion
//-----------RENDERER OBJECT-----------
//The object that the user will initiate at the start
//The user won't interact with this much
//#region 

class Renderer{
    //The actual rendering code, scene code will follow this.
    /**
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
                //if(this.gl===null){
                //    throw new Error("WebGL at a whole is not supported. Please use a different browser.");
                //}
            }
        }
        if(!disableDepthTest){
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }
        if(!disableCullFace)
            this.gl.enable(this.gl.CULL_FACE);
        if(!disableAlphaBlend){
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA)
        }
        this.aspect = canvas.clientWidth/canvas.clientHeight;
        if(!disableAutoAdjustAspectRatio){
            this.canvas.addEventListener("resize",function(){
                console.log("bruh")
                this.aspect = canvas.clientWidth/canvas.clientHeight;
            });
        }
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
     * @param {RenderablePackage} package The package to draw
     * @param {Number} renderType The way the package is rendered, for example glDictionary.TRIANGLES
     */
    drawPackage(renderPackage,renderType){
        var renderTypes = [this.gl.TRIANGLE_STRIP,this.gl.TRIANGLES,this.gl.POINTS,this.gl.LINES]
        if(!renderType){
            renderType = this.gl.TRIANGLES;
        } else {
            renderType = renderTypes[renderType]
        }
        var buffers = renderPackage.bufferList;
        for(var i=0; i<buffers.length;i++){
            buffers[i].enableForProgram(renderPackage.program)
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
                this.gl.drawArrays(renderType,0,renderPackage.indexAmount)
                break;
        }
    }
}
//#endregion
//-----------SCENE-----------
//#region
//-----MAIN SCENE-----
//#region 
class Scene{
    /**
     * A space where 3D objects are placed. 
     * The viewer views a scene through the camera which is placed inside.
     * @param {Renderer} renderer 
     */
    constructor(renderer){
        this.renderer = renderer;
        this.camera = {
            position:[0,0,0],
            direction:[0,0,0],
            fovy:45,
            near:glMath.EPSILON,
            far:100,
            lastViewMatrix:new Mat4(),
            viewMatrixInitialized:false
        };
        this.objects = [];
        this.bgcolor = [0,0,0,1];
        this.lighting = {
            directionalLighting:{
                direction:[0,0,0],
            }
        }
    }
    moveCamera(vector){
        this.camera.position = vec3.add(this.camera.position,vector);
        this.camera.viewMatrixInitialized = false;
    }
    rotateCamera(vector){
        this.camera.direction = vec3.add(this.camera.direction,vector);
        this.camera.viewMatrixInitialized = false;
    }
    setFOV(fov){
        this.camera.fovy = fov;
    }
    projectCamera(){
        if(!this.camera.viewMatrixInitialized){
            //Ugh I hate math so much
            var v = [0,0,-1], vector=[0,1,0];
            //ROTATE Z
            var sin = Math.sin(glMath.toRadians(this.camera.direction[2])),cos=Math.cos(glMath.toRadians(this.camera.direction[2]))
            var a = v[0],b=v[1]
            v[0] = a*cos - b*sin;
            v[1] = a*sin + b*cos;
            a = vector[0],b=vector[1]
            vector[0] = a*cos - b*sin;
            vector[1] = a*sin + b*cos;
            //ROTATE Y
            var sin = Math.sin(glMath.toRadians(this.camera.direction[1])),cos=Math.cos(glMath.toRadians(this.camera.direction[1]))
            var a = v[0],b=v[2]
            v[0] = a*cos - b*sin;
            v[2] = a*sin + b*cos;
            var a = vector[0],b=vector[2]
            vector[0] = a*cos - b*sin;
            vector[2] = a*sin + b*cos;
            //ROTATE X
            var sin = Math.sin(glMath.toRadians(this.camera.direction[0])),cos=Math.cos(glMath.toRadians(this.camera.direction[0]))
            var a = v[2],b=v[1]
            v[2] = a*cos - b*sin;
            v[1] = a*sin + b*cos;
            var a = vector[2],b=vector[1]
            vector[2] = a*cos - b*sin;
            vector[1] = a*sin + b*cos;
            var viewMatrix = new Mat4();
            viewMatrix.lookAt(this.camera.position,vec3.add(this.camera.position,v),vector);
            this.camera.lastViewMatrix = viewMatrix;
            this.camera.viewMatrixInitialized = true;
        } else {
            var viewMatrix = this.camera.lastViewMatrix;
        }
        var projectionMatrix = new Mat4();
        projectionMatrix.perspective(
            this.camera.fovy,
            this.renderer.aspect,
            this.camera.near,
            this.camera.far);
        return {
            viewMatrix:viewMatrix,
            projectionMatrix:projectionMatrix
        };
    }
    addObject(object){
        this.objects.push(object);
    }
    removeObject(object){
        this.objects.splice(this.objects.indexOf(object),1)
    }
    clear(){
        this.objects = [];
    }
    setBackground(color){
        if(color.startsWith("#")){
            this.bgcolor = glLibrary.hex2rgb(color)
        }
    }
    render(){
        this.renderer.clear(...this.bgcolor);
        var uniforms = this.projectCamera();
        for(var i=0; i<this.objects.length; i++){
            try{
            var renderablePackage = this.objects[i].package(this.renderer,uniforms.viewMatrix,uniforms.projectionMatrix);
            this.renderer.drawPackage(renderablePackage,renderablePackage.typeOfRender);
            }catch{
                console.warn(`Object number ${i} is not processable. Are you sure it is a valid object?`)
            }
        }
    }
}
//#endregion
//-----SCENE OBJECTS-----
class Mesh{
    /**
     * A 3D Object made of several triangles
     * @param {Array<Number>} vertexData
     * @param {Array<Number>} indexData
     * @param {*} material
     * @param {Boolean} manuallySpecifyNormals
     * @param {Array<Number>} normals
     */
    constructor(vertexData,indexData,material,manuallySpecifyNormals,normals){
        if(manuallySpecifyNormals){
            this.normals = normals;
            this.vertexData = vertexData;
            this.indexData = indexData;
        } else {
            this.vertexData = [];
            this.indexData = [];
            this.normals = [];
            var vd = vertexData;
            for(var i=0; i<indexData.length/3; i++){
                var idx = [indexData[i*3]*3,indexData[i*3+1]*3,indexData[i*3+2]*3]
                var triangle = [
                    [vd[idx[0]],vd[idx[0]+1],vd[idx[0]+2]],
                    [vd[idx[1]],vd[idx[1]+1],vd[idx[1]+2]],
                    [vd[idx[2]],vd[idx[2]+1],vd[idx[2]+2]]
                ]
                var normal = triangleFunctions.getSurfaceNormal(...triangle)
                this.vertexData.push(...[...triangle[0],...triangle[1],...triangle[2]])
                this.normals.push(normal,normal,normal)
                this.indexData.push(i*3,i*3+1,i*3+2)
            }   
        }
        this.material = material;
        this.visible = true;
        this.tags = undefined;
        this.transform = {
            position:[0,0,0],
            rotation:[0,0,0],
            scale:[1,1,1],
            transformStayedSame:false,
            worldMatrix:null
        }
        
    }
    addTag(tag){
        this.tags.push(tag);
    }
    removeTag(){
        this.tag = undefined;
    }
    scale(vector){
        this.transform.scale = vector;
        this.transform.transformStayedSame = false;
    }
    rotate(vector){
        this.transform.rotation = vec3.add(vector,this.transform.rotation)
        this.transform.transformStayedSame = false;
    }
    translate(vector){
        this.transform.position = vec3.add(vector,this.transform.position)
        this.transform.transformStayedSame = false;
    }
    setMaterial(material){
        this.material = material;
    }
    package(renderer,viewMatrix,projectionMatrix){
        if(this.material.lastCompiled){
            var shaderProgram = this.material.compiled;
        }
        
        
    }
}
//-------Easy to init primitives-------
//#region
class Cube extends Mesh{
    /**
     * An object with 8 vertices and 6 faces
     * @param {Number} size 
     */
    constructor(size,material){
        super([
            //Back
            -size,size,-size,
            size,size,-size,
            -size,-size,-size,
            size,-size,-size,
            //Front
            -size,size,size,
            size,size,size,
            -size,-size,size,
            size,-size,size,
            //Left
            -size,size,size,
            -size,size,-size,
            -size,-size,size,
            -size,-size,-size,
            //Right
            size,-size,size,
            size,-size,-size,
            size,size,size,
            size,size,-size,
            //Top
            -size,size,size,
            size,size,size,
            -size,size,-size,
            size,size,-size,
            //Bottom
            -size,-size,-size,
            size,-size,-size,
            -size,-size,size,
            size,-size,size,
            
        ],[
            3,2,0,
            0,1,3,
            4,6,7,
            7,5,4,
            11,10,8,
            8,9,11,
            15,14,12,
            12,13,15,
            17,19,16,
            19,18,16,
            21,23,20,
            23,22,20
        ],material)
    }
}
class Sphere extends Mesh{
    /**
     * A circular object with a resemblance to a ball
     * @param {Number} radius 
     * @param {Number} div
     */
    constructor(radius,div,material){
        var points = [],indicies = [];
        for(var j=0; j<=div; j++){
            var anglej = j*Math.PI / div;
            var sinj = Math.sin(anglej);
            var cosj = Math.cos(anglej);
            for(var i=0; i<=div; i++){
                var anglei=i*2*Math.PI/div;
                var sini = Math.sin(anglei);
                var cosi = Math.cos(anglei);
                points.push(radius*sini*sinj);
                points.push(radius*cosj);
                points.push(radius*cosi*sinj);
            }
        }
        for(var j=0; j<div;j++){
            for(var i=0; i<div; i++){
                var point1 = j*(div+1)+i;
                var point2 = point1 + (div+1);
                indicies.push(point1);
                indicies.push(point2);
                indicies.push(point1+1);
                indicies.push(point1 + 1);
                indicies.push(point2);
                indicies.push(point2+1);
            }
        }
        super(points,indicies,material)
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
     */
    constructor(source){
        this.source = source.replaceAll(/\n|\r|\t/gi," ");
        //this.usage = usage;
    }
    compile(renderer){
        const gl = renderer.gl
        const shader = gl.createShader(renderer.gl.VERTEX_SHADER);
        gl.shaderSource(shader,this.source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            
            throw new Error(`An error occurred while compiling the vertex shader: ${gl.getShaderInfoLog(shader)}`);
            
        }
        return shader;
    }
}

class FragmentShader{
    /**
     * 
     * @param {String} source 
     */
    constructor(source){
        this.source = source.replaceAll(/\n|\r|\t/gi," ");
        //this.usage = usage;
    }
    compile(renderer){
        const gl = renderer.gl
        const shader = gl.createShader(renderer.gl.FRAGMENT_SHADER);
        gl.shaderSource(shader,this.source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            throw new Error(`An error occurred while compiling the fragment shader: ${gl.getShaderInfoLog(shader)}`);
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
     * @param {Boolean} validate
     * @returns 
     */
    constructor(renderer,vshader,fshader,validate){
        const gl = renderer.gl;
        const vertexShader = vshader.compile(renderer);
        const fragmentShader = fshader.compile(renderer);
        const program = gl.createProgram();
        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
            throw new Error(`An error occurred while validating the program: ${gl.getProgramInfoLog(program)}`);
        }
        if(validate){
            gl.validateProgram(program);
            if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
                throw new Error(`An error occurred while validating the program: ${gl.getProgramInfoLog(program)}`);
            }
        }
        this.program = program;
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
                this.render.gl.getAttribLocation(program,this.attribute),
                this.programData[0],
                this.programData[1],
                this.programData[2],
                this.programData[3],
                this.programData[4],
            )
            this.render.gl.enableVertexAttribArray(this.render.gl.getAttribLocation(program,this.attribute));
        } else if(this.type == glDictionary.NONATTRIBUTE){
            this.render.gl.bindBuffer(this.usageType,this.buffer)
        }
    }
}
class PositionBuffer extends Buffer{
    constructor(render,data,attribute){
        super(render,data,attribute,null,glDictionary.ATTRIBUTE,[
            3,
            render.gl.FLOAT,
            render.gl.FALSE,
            3*Float32Array.BYTES_PER_ELEMENT,
            0
        ],render.gl.ARRAY_BUFFER);
    }
}
class IndexBuffer extends Buffer{
    constructor(render,data){
        super(render,data,"",null,glDictionary.NONATTRIBUTE,[],render.gl.ELEMENT_ARRAY_BUFFER,Uint16Array);
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
//#endregion
//#endregion
//-----------PACKAGES-----------
//Just compacts everything together for renderer to process.
//#region 
class RenderablePackage{
    /**
     * 
     * @param {ShaderProgram} shaderProgram The shader program
     * @param {Array} bufferList Buffers
     * @param {Number} renderType The type to draw from, e.g. TRIANGLES
     * @param {Array} uniformList Uniforms
     * @param {Number} offset Offset
     * @param {Boolean} usesIndexBuffer Uses index buffer?
     * @param {Number} numElements Number of elements
     */
    constructor(shaderProgram,renderType,typeOfRender,bufferList,uniformList,offset,usesIndexBuffer,numElements){
        this.shaderProgram = shaderProgram;
        this.program = shaderProgram.program;
        this.bufferList = bufferList;
        this.uniformList = uniformList;
        this.renderType = renderType;
        this.typeOfRender = typeOfRender;
        this.offset = offset;
        this.usesIndexBuffer = usesIndexBuffer;
        this.indexAmount = numElements;
    }
}
//#endregion
//-----------MATERIALS-----------
//Materials for easier use of the library
//#region 
class SingleColorMaterial{
    constructor(color,params){
        this.lastCompiled = false;
        this.compiled = null;
        this.color = color;
        this.params = params;
    }
    /**
     * @param {Renderer} render
     * @param {Mesh} mesh 
     * @param {Scene} scene 
     */
    build(render,mesh,scene){
        if(!this.lastCompiled){
            
            let vertexShaderSource = `
attribute vec3 vP;
attribute vec3 vN;
attribute int nPLS;
attribute int nSLS;
uniform mat4 pM;
uniform mat4 vM;
uniform mat4 wM;
uniform vec3 pL[];
uniform vec3 dL[2];
${
    glDictionary.USES_FRAGMENT_LIGHTING in params?"varying vec3 vN;":
    glDictionary.USES_VERTEX_LIGHTING in params?"varying vec3 vC;":
    ""
}
void main(void){
    gl_Position = pM*vM*wM*vec4(vN);
    ${gl.dictionary.USES_VERTEX_LIGHTING in params?`
    //Implement Point Lighting.
    for(int i=0; i<nPLS){

    }
`:""}
}
`
            this.lastCompiled = true;
            
        } else {
            return this.compiled;
        }
    }
}
//#endregion