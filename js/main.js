//MAIN FILE OF THE LIBRARY

/**
 * C.A.T.S.
 * Che's Awesome Three-dimensional toolS
 * 
 * Created by Che Yu.
 * 
 * Now that's a lot of code.
 */
//-----------MISC-----------
//#region 
/**
 * CATS Functions & Variables
 */
const CATS = {
    math:{
        toRadians:function(degrees){
            return degrees*(Math.PI/180)
        },
        EPSILON:1e-4,
        printAsMatrix:function(matrix){
            var m = matrix.data;
            console.log(m[0],m[4],m[8],m[12])
            console.log(m[1],m[5],m[9],m[13])
            console.log(m[2],m[6],m[10],m[14])
            console.log(m[3],m[7],m[11],m[15])
        },
        vec3:{
            normalize:function(vector){
                thing = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])
                if(!thing){
                    return [0,0,0]
                } else {
                    return [vector[0]/thing,vector[1]/thing,vector[2]/thing]
                }
            },
            add:function(a,b){
                return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
            },
            subtract:function(a,b){
                return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]
            },
            cross:function(a,b){
                return [
                    a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0]
                ]
            },
            dot:function(a,b){
                return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
            },
            hypot:function(vector){
                return Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])
            },
            multiplyByNumber:function(a,b){
                return [a[0]*b,a[1]*b,a[2]*b]
            },
            divideByNumber:function(a,b){
                return [a[0]/b,a[1]/b,a[2]/b]
            },
            invert:function(v){
                return [v[0]*-1,v[1]*-1,v[2]*-1]
            }
        },
        triangle:{
            getSurfaceNormal:function(v1,v2,v3){
                var u = CATS.math.vec3.subtract(v2,v1)
                var v = CATS.math.vec3.subtract(v3,v1)
                return CATS.math.vec3.normalize(CATS.math.vec3.cross(u,v))
            }
        },
        oneOver255:1/255,
    },
    enum:{
        TRIANGLE_STRIP:0,
        TRIANGLES:1,
        POINT_CLOUD:2,
        LINES:3,
        ATTRIBUTE:4,
        UNIFORM:5,
        NON_ATTRIBUTE:6,
        ARRAYS:7,
        ELEMENTS:8,
        USES_COLOR_BUFFER:9,
        USES_TEXTURE_BUFFER:10,
        USES_NO_BUFFER:11,
        RGBA:12,
        FRIENDLY_RGBA:13,
        RGB:14,
        FRIENDLY_RGB:15,
        HEX:16, // WOAH SO COOL
        HSV:17,
        DIRECTIONAL_LIGHTING_ENABLED:18,
        USES_FRAGMENT_LIGHTING:19,
        USES_VERTEX_LIGHTING:20,
        ARRAY_BUFFER:21,
        ELEMENT_ARRAY_BUFFER:22,
        DISABLE_DEPTH_TEST:23,
        DISABLE_CULL_FACE:24,
        DISABLE_AUTO_ADJUST_ASPECT_RATIO:25,
        DISABLE_ALPHA_BLEND:26,
    },
    /**
     * Converts a color to a more readable interface for CATS
     * Note that if you are using colors in range from 0-1, then there is no need to run this function.
     * Examples include:
     * [1.0,1.0,1.0] for white
     * [1.0,1.0,0.0,0.5] for translucent yellow
     * @param {Array|String} color 
     */
    Color(color){
        if(color instanceof Array){

        } else if(typeof color == "string"){
            if(color.startsWith("#")){
                var hex = color.slice(1);
                var r = parseInt(hex.slice(0,2),16)*this.math.oneOver255
                var g = parseInt(hex.slice(2,4),16)*this.math.oneOver255
                var b = parseInt(hex.slice(4,6),16)*this.math.oneOver255
                return [r,g,b,1.0]
            } else if(color.startsWith("rgb")){
                var rgba = color.slice(3);
                var hasAlpha = rgba.startsWith("a");
                if(hasAlpha)
                    rgba = color.slice(1)
                rgba = rgba.replaceAll(/"("|")"|";"/gi)
            }
        } else {
            throw new TypeError(`Oops! It looks like CATS cannot parse this data type.\nData type:${color.constructor}`)
        }
    }
}
Object.freeze(CATS)

//#endregion
//-----------RENDERER OBJECT-----------
//The object that the user will initiate at the start
//The user won't interact with this much
//#region 
class Renderer{
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
     * Draws an inputted renderable data package
     * Used INTERNALLY by CATS.
     * @param {RenderablePackage} package The package to draw.
     */
    drawPackage(renderPackage){
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
            case CATS.enum.ELEMENTS:
                this.gl.drawElements(renderType,renderPackage.params.numElements,this.gl.UNSIGNED_SHORT,renderPackage.params.offset);
                break;
            case CATS.enum.ARRAYS:
                this.gl.drawArrays(renderType,0,renderPackage.params.numElements)
                break;
        }
    }
}
//#endregion
//-----------SCENE-----------
//What the user interacts with the most.
//Makes easier use of the library
//#region
//-----SCENE-----
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
            fovy:70,
            near:CATS.math.EPSILON,
            far:100,
            lastViewMatrix:new Mat4(),
            viewMatrixInitialized:false
        };
        this.objects = [];
        this.bgcolor = [0,0,0,1];
        this.lighting = {
            maxLightSources:1000
        }
    }
    moveCamera(vector){
        this.camera.position = CATS.math.vec3.add(this.camera.position,vector);
        this.camera.viewMatrixInitialized = false;
    }
    rotateCamera(vector){
        this.camera.direction = CATS.math.vec3.add(this.camera.direction,vector);
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
            var sin = Math.sin(CATS.math.toRadians(this.camera.direction[2])),cos=Math.cos(CATS.math.toRadians(this.camera.direction[2]))
            var a = v[0],b=v[1]
            v[0] = a*cos - b*sin;
            v[1] = a*sin + b*cos;
            a = vector[0],b=vector[1]
            vector[0] = a*cos - b*sin;
            vector[1] = a*sin + b*cos;
            //ROTATE Y
            var sin = Math.sin(CATS.math.toRadians(this.camera.direction[1])),cos=Math.cos(CATS.math.toRadians(this.camera.direction[1]))
            var a = v[0],b=v[2]
            v[0] = a*cos - b*sin;
            v[2] = a*sin + b*cos;
            var a = vector[0],b=vector[2]
            vector[0] = a*cos - b*sin;
            vector[2] = a*sin + b*cos;
            //ROTATE X
            var sin = Math.sin(CATS.math.toRadians(this.camera.direction[0])),cos=Math.cos(CATS.math.toRadians(this.camera.direction[0]))
            var a = v[2],b=v[1]
            v[2] = a*cos - b*sin;
            v[1] = a*sin + b*cos;
            var a = vector[2],b=vector[1]
            vector[2] = a*cos - b*sin;
            vector[1] = a*sin + b*cos;
            var viewMatrix = new Mat4();
            viewMatrix.lookAt(this.camera.position,CATS.math.vec3.add(this.camera.position,v),vector);
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
            this.bgcolor = CATS.hex2rgb(color)
        }
    }
    render(){
        this.renderer.clear(...this.bgcolor);
        var uniforms = this.projectCamera();
        for(var i=0; i<this.objects.length; i++){
            try{
            var renderablePackage = this.objects[i].convertToPackage(this.renderer,uniforms.viewMatrix,uniforms.projectionMatrix,this);
            this.renderer.drawPackage(renderablePackage,renderablePackage.typeOfRender);
            }catch(e){
                console.warn(`An error occoured while trying to process object #${i} in scene.\n\n${e.stack}`)
            }
        }
    }
}
//#endregion
//-----SCENE OBJECTS-----
class Mesh{
    /**
     * A 3D Object made of several triangles
     * @param {Array<Number>} vertices
     * @param {Array<Number>} indices
     * @param {Material} material
     * @param {Boolean} manuallySpecifyNormals
     * @param {Array<Number>} normals
     */
    constructor(vertices,indices,material,manuallySpecifyNormals,normals){
        if(manuallySpecifyNormals){
            this.normals = normals;
            this.vertices = vertices;
            this.indices = indices;
        } else {
            this.vertices = [];
            this.indices = [];
            this.normals = [];
            var vd = vertices;
            for(var i=0; i<indices.length/3; i++){
                var idx = [indices[i*3]*3,indices[i*3+1]*3,indices[i*3+2]*3]
                var triangle = [
                    [vd[idx[0]],vd[idx[0]+1],vd[idx[0]+2]],
                    [vd[idx[1]],vd[idx[1]+1],vd[idx[1]+2]],
                    [vd[idx[2]],vd[idx[2]+1],vd[idx[2]+2]]
                ]
                var normal = CATS.math.triangle.getSurfaceNormal(...triangle)
                
                this.vertices.push(...[...triangle[0],...triangle[1],...triangle[2]])
                this.normals.push(...[...normal,...normal,...normal])
                this.indices.push(i*3,i*3+1,i*3+2)
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
            transformMatrix:null
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
        this.transform.rotation = CATS.math.vec3.add(vector,this.transform.rotation)
        this.transform.transformStayedSame = false;
    }
    translate(vector){
        this.transform.position = CATS.math.vec3.add(vector,this.transform.position)
        this.transform.transformStayedSame = false;
    }
    setMaterial(material){
        this.material = material;
    }
    convertToPackage(renderer,viewMatrix,projectionMatrix,scene){
        if(!this.transform.transformStayedSame){
            var matrix = new Mat4();
            matrix.scale(this.transform.scale)
            matrix.rotate(this.transform.rotation)
            matrix.translate(this.transform.position)
            this.transform.transformMatrix = matrix;
            this.transform.transformStayedSame = true;
            var normalMatrix = new Mat4()
            normalMatrix.set(matrix)
            normalMatrix.invert()
            normalMatrix.transpose()
        }
        var builtMaterial = this.material.build(renderer,this,scene);
        var shaderProgram = builtMaterial.shaderProgram
        var parameters = builtMaterial.parameters;
        console.log(builtMaterial)
        var newParameters = [];
        var newparameter;
        for(var i=0; i<parameters.length; i++){
            newparameter = new parameters[i].type(renderer,parameters[i].value,parameters[i].name);
            newParameters.push(newparameter)
        }
        var positionBuffer = new PositionBuffer(renderer,this.vertices,"vP");
        var indexBuffer = new IndexBuffer(renderer,this.indices);
        var normalBuffer = new PositionBuffer(renderer,this.normals,"vN")
        var transformUniform = new Uniform4x4Matrix(renderer,this.transform.transformMatrix,"wM");
        var viewUniform = new Uniform4x4Matrix(renderer,viewMatrix,"vM");
        var projectionUniform = new Uniform4x4Matrix(renderer,projectionMatrix,"pM");
        var normalUniform = new Uniform4x4Matrix(renderer,)
        var shaderInput = [positionBuffer,normalBuffer,indexBuffer,transformUniform,viewUniform,projectionUniform];
        shaderInput.concat(parameters);
        //constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params)
        var renderpackage = new RenderablePackage(shaderProgram,shaderInput,CATS.enum.ELEMENTS,CATS.enum.TRIANGLES,{
            numElements:this.indices.length,
            offset:0
        })
        return renderpackage;
    }
}
//-------Easy to initialize primitives-------
//#region
class Cube extends Mesh{
    /**
     * An object with 8 vertices and 6 faces.
     * Resembles a box.
     * @param {Number} size The size of the cube.
     * @param {Material} material The material of the cube.
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
     * A circular object resembling a ball.
     * @param {Number} radius The radius of the sphere
     * @param {Number} div The division of the sphere, higher the smoother
     * @param {Material} material The material applied to the sphere
     */
    constructor(radius,div,material){
        var points = [],indices = [];
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
                indices.push(point1);
                indices.push(point2);
                indices.push(point1+1);
                indices.push(point1 + 1);
                indices.push(point2);
                indices.push(point2+1);
            }
        }
        super(points,indices,material)
    }
}
class Plane extends Mesh{
    /**
     * A flat object resembling a square.
     * @param {Number} size The size of the plane.
     * @param {Material} material The material applied to the plane.
     */
    constructor(size,material){
        var vertices = [
            size,0,size,
            -size,0,size,
            -size,0,-size,
            size,0,-size            
        ];
        var indices = [
            0,1,2,
            1,3,2,
        ]
        super(vertices,indices,material,false)
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
        this.source = source;
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
        this.source = source;
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
    /**
     * A WebGL buffer template used internally in CATS.
     * This object is not recommended for general purpose use.
     * @param {Renderer} renderer 
     * @param {Array} data 
     * @param {*} dataType 
     * @param {Object} params 
     * @param {Number} usage 
     */
    constructor(renderer,data,dataType,params,usage){
        if(!params.usageType){
            this.usageType = CATS.enum.ARRAY_BUFFER;
        }
        if(!params.type){
            this.type = CATS.enum.ATTRIBUTE
        } else {
            this.type = params.type
        }
        this.renderer = renderer;
        this.data = data;
        this.attribute = params.attribute;
        this.usageType = {
21:this.renderer.gl.ARRAY_BUFFER,
22:this.renderer.gl.ELEMENT_ARRAY_BUFFER
        }[params.usageType]
        const gl = this.renderer.gl;
        const newBuffer = gl.createBuffer();
        this.params = params;
        gl.bindBuffer(this.usageType,newBuffer);
        gl.bufferData(this.usageType,
            dataType?new dataType(data):new Float32Array(data),
            usage?usage:gl.STATIC_DRAW
        );
        this.buffer = newBuffer;
    }
    enableForProgram(program){
        if(this.type == CATS.enum.ATTRIBUTE){
            var location = this.renderer.gl.getAttribLocation(program,this.attribute)
            this.renderer.gl.bindBuffer(this.usageType,this.buffer)
            this.renderer.gl.vertexAttribPointer(location,
                this.params.vertexAttribParams.numberOfComponents,
                this.params.vertexAttribParams.type,
                this.params.vertexAttribParams.normalize,
                this.params.vertexAttribParams.stride,
                this.params.vertexAttribParams.offset
            );
            this.renderer.gl.enableVertexAttribArray(location)
        } else {
            this.renderer.gl.bindBuffer(this.usageType,this.buffer)
        }
    }
}
class PositionBuffer extends Buffer{
    /**
     * An WebGL Buffer Object used internally in CATS.
     * This object is not recommended for general purpose use.
     * @param {Renderer} render 
     * @param {Array} data 
     * @param {String} attribute 
     */
    constructor(render,data,attribute){
        /*
        super(render,data,attribute,null,CATS.enum.ATTRIBUTE,[
            3,
            render.gl.FLOAT,
            render.gl.FALSE,
            3*Float32Array.BYTES_PER_ELEMENT,
            0
        ],render.gl.ARRAY_BUFFER);*/
        super(render,data,Float32Array,{
            vertexAttribParams:{
                numberOfComponents:3,
                type:render.gl.FLOAT,
                normalize:render.gl.FALSE,
                stride:3*Float32Array.BYTES_PER_ELEMENT,
                offset:0
            },
            usageType:CATS.enum.ARRAY_BUFFER,
            type:CATS.enum.ATTRIBUTE,
            attribute:attribute
        },)
    }
}
class IndexBuffer extends Buffer{
    constructor(render,data){
        /*
        super(render,data,"",null,CATS.enum.NON_ATTRIBUTE,[],render.gl.ELEMENT_ARRAY_BUFFER,Uint16Array);
        */
        super(render,data,Uint16Array,{
            usageType:CATS.enum.ELEMENT_ARRAY_BUFFER,
            type:CATS.enum.NON_ATTRIBUTE
        })
    }
}
//#endregion
//-----Uniforms-----
//#region 
//Apparently, uniforms aren't buffers so I have to include them here.
//Later I found out that there are multiple types of uniforms so I'm glad I named them like this

class Uniform4x4Matrix{
    constructor(render,matrix,attribute){
        this.matrix = matrix;
        this.attribute = attribute;
        this.render = render;
        this.tag = "UNIFORM";
    }
    enableForProgram(program){
        this.render.gl.uniformMatrix4fv(this.render.gl.getUniformLocation(program,this.attribute),
        this.render.gl.FALSE,
        this.matrix.data)
    }
}
class UniformVector3{
    constructor(render,vector,attribute){
        this.vector = vector;
        this.attribute = attribute;
        this.render = render;
        this.tag = "UNIFORM";
    }
    enableForProgram(program){
        this.render.gl.uniform3fv(this.render.gl.getUniformLocation(program,this.attribute),new Float32Array(this.vector));
    }
}
class UniformVector4{
    constructor(render,vector,attribute){
        this.vector = vector;
        this.attribute = attribute;
        this.render = render;
        this.tag = "UNIFORM";
    }
    enableForProgram(program){
        this.render.gl.uniform4fv(this.render.gl.getUniformLocation(program,this.attribute),new Float32Array(this.vector));
    }
}

//This part is also useless but kinda useful...
//#endregion
//#endregion
//-----------PACKAGES-----------
//Just compacts everything together for renderer to process.
//#region 
class RenderablePackage{
    constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params){
        this.shaderProgram = shaderProgram;
        this.bufferList = [];
        this.uniformList = [];
        for(var i=0; i<shaderInputs.length; i++){
            if(shaderInputs[i].tag === "UNIFORM"){
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
//#endregion
//-----------MATERIALS-----------
//Materials for easier use of the library.
//Each material is just a huge hunk of code.
//#region 



class SingleColorMaterial{
    constructor(color,params){
        this.lastCompiled = false;
        this.compiled = null;
        this.color = color;
        this.params = params;
    }
    build(render,mesh,scene){
        if(!this.lastCompiled){
            
            let vertexShaderSource = `
precision mediump float;
attribute vec3 vP;
attribute vec3 vN;
uniform mat4 wM;
uniform mat4 vM;
uniform mat4 pM;
uniform mat4 nM;
varying mediump vec3 fN;
void main(void){
    vec3 newVN = vec3(nM*vec4(vN,1.0))
    gl_Position = pM*vM*wM*vec4(vP,1.0);
    fN = vN;
}
`
            let fragmentShaderSource = `
precision mediump float;
varying mediump vec3 fN;
uniform vec3 inverseLightDirection;
uniform vec4 objectColor;
void main(void){
    gl_FragColor = vec4(fN,1.0);
}
            `
            let vertexShader = new VertexShader(vertexShaderSource);
            let fragmentShader = new FragmentShader(fragmentShaderSource);
            let shaderProgram = new ShaderProgram(render,vertexShader,fragmentShader);
            this.lastCompiled = true;
            this.compiled = {
                shaderProgram:shaderProgram,
                parameters:this.params?this.params:[]
            }
            return this.compiled;
        } else {
            return this.compiled;
        }
    }
}
//#endregion
//-----------MATH-----------
//Some files for math related things
//#region 
/**
 * A 4x4 matrix for WebGL.
 * Calling the constructor will create a 4x4 identity matrix.
 * This object is generally used internally by CATS to handle transforms.
 */
class Mat4{
    constructor(){
        this.data = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
        this.length = 16;
    }
    /**
     * 
     * @param {Mat4} a 
     * @param {Mat4} b 
     */
    multiply(b){
        var a = this;
        if(b instanceof Mat4){
            var newMat4 = new Mat4();
            //There are 4 dot products when multiplying two Mat4
            for(var i=0; i<4; i++){
                //Calculate each dot product
                for(var j=0; j<4; j++){
                    newMat4.data[i*4+j] = 0;
                    for (var k=0; k<4; k++){
                        newMat4.data[i*4+j]+=a.data[i*4+k]*b.data[k*4+j]
                    }
                }
            }
            this.set(newMat4);
        } else if( b instanceof Array){
            var v = b;
            var m = a.data;
            return [
                v[0]*m[0]+v[1]*m[4]+v[2]*m[8]+v[3]*m[12],
                v[0]*m[1]+v[1]*m[5]+v[2]*m[9]+v[3]*m[13],
                v[0]*m[2]+v[1]*m[6]+v[2]*m[10]+v[3]*m[14],
                v[0]*m[3]+v[1]*m[7]+v[2]*m[11]+v[3]*m[15],
            ];
        }
    }
    /**
     * 
     * @param {Mat4} a 
     * @param {Mat4} b 
     */
    add(a,b){
        this.data[0] = a[0]+b[0]
        this.data[1] = a[1]+b[1]
        this.data[2] = a[2]+b[2]
        this.data[3] = a[3]+b[3]
        this.data[4] = a[4]+b[4]
        this.data[5] = a[5]+b[5]
        this.data[6] = a[6]+b[6]
        this.data[7] = a[7]+b[7]
        this.data[8] = a[8]+b[8]
        this.data[9] = a[9]+b[9]
        this.data[10] = a[10]+b[10]
        this.data[11] = a[11]+b[11]
        this.data[12] = a[12]+b[12]
        this.data[13] = a[13]+b[13]
        this.data[14] = a[14]+b[14]
        this.data[15] = a[15]+b[15]
    }
    identity(){
        this.data[0] = 1
        this.data[1] = 0
        this.data[2] = 0
        this.data[3] = 0
        this.data[4] = 0
        this.data[5] = 1
        this.data[6] = 0
        this.data[7] = 0
        this.data[8] = 0
        this.data[9] = 0
        this.data[10] = 1
        this.data[11] = 0
        this.data[12] = 0
        this.data[13] = 0
        this.data[14] = 0
        this.data[15] = 1
    }
    subtract(a,b){
        this.data[0] = a[0]-b[0]
        this.data[1] = a[1]-b[1]
        this.data[2] = a[2]-b[2]
        this.data[3] = a[3]-b[3]
        this.data[4] = a[4]-b[4]
        this.data[5] = a[5]-b[5]
        this.data[6] = a[6]-b[6]
        this.data[7] = a[7]-b[7]
        this.data[8] = a[8]-b[8]
        this.data[9] = a[9]-b[9]
        this.data[10] = a[10]-b[10]
        this.data[11] = a[11]-b[11]
        this.data[12] = a[12]-b[12]
        this.data[13] = a[13]-b[13]
        this.data[14] = a[14]-b[14]
        this.data[15] = a[15]-b[15]
    }
    /**
     * 
     * @param {Number|Mat4} a0 
     * @param {Number} a1 
     * @param {Number} a2 
     * @param {Number} a3 
     * @param {Number} b0 
     * @param {Number} b1 
     * @param {Number} b2 
     * @param {Number} b3 
     * @param {Number} c0 
     * @param {Number} c1 
     * @param {Number} c2 
     * @param {Number} c3 
     * @param {Number} d0 
     * @param {Number} d1 
     * @param {Number} d2 
     * @param {Number} d3 
     */
    set(a0,a1,a2,a3,b0,b1,b2,b3,c0,c1,c2,c3,d0,d1,d2,d3){
        if(!a0 instanceof Mat4){
        this.data[0] = a0
        this.data[1] = a1
        this.data[2] = a2
        this.data[3] = a3
        this.data[4] = b0
        this.data[5] = b1
        this.data[6] = b2
        this.data[7] = b3
        this.data[8] = c0
        this.data[9] = c1
        this.data[10] = c2
        this.data[11] = c3
        this.data[12] = d0
        this.data[13] = d1
        this.data[14] = d2
        this.data[15] = d3
        }else{
            for(var i=0; i<16; i++){
                this.data[i] = a0.data[i]
            }
        }
    }
    /**
     * 
     * @param {Number} fovy 
     * @param {Number} aspect 
     * @param {Number} near 
     * @param {Number} far 
     * Got me lost too many braincells.
     */
    perspective(fovy,aspect,near,far){
        var top,bottom,left,right;
        top = near*Math.tan(CATS.math.toRadians(fovy)/2)
        bottom = -top;
        right = top*aspect;
        left = -right
        this.data[0] = 2*near/(right-left)
        this.data[1] = 0
        this.data[2] = (right+left)/(right-left)
        this.data[3] = 0
        this.data[4] = 0
        this.data[5] = 2*near/(top-bottom)
        this.data[6] = (top+bottom)/(top-bottom)
        this.data[7] = 0
        this.data[8] = 0
        this.data[9] = 0
        this.data[10] = -((far+near)/(far-near))
        this.data[11] = -1
        this.data[12] = 0
        this.data[13] = 0
        this.data[14] = -((2*far*near)/(far-near))
        this.data[15] = 0
    }
    /**
     * Too many functions
     * @param {Array} vector 
     */
    translate(vector){
        var translationMatrix = new Mat4()
        translationMatrix.data[12] = vector[0]
        translationMatrix.data[13] = vector[1]
        translationMatrix.data[14] = vector[2]
        this.multiply(translationMatrix);
    }
    /**
     * Enter a vector with 3 DEGREE values not radians
     * @param {Number} degrees 
     * @param {Array} origin 
     */
    rotate(vector){
        //Please don't run slowly, even though I did 6 sin and cos.
        var [x,y,z] = vector;
        x=CATS.math.toRadians(x)
        y=CATS.math.toRadians(y)
        z=CATS.math.toRadians(z)
        var zrm = new Mat4();
        var cos,sin;
        cos=Math.cos(z);
        sin=Math.sin(z);
        zrm.data[0] = cos;
        zrm.data[1] = -sin;
        zrm.data[4] = sin;
        zrm.data[5] = cos;
        var yrm = new Mat4();
        cos=Math.cos(y);
        sin=Math.sin(y);
        yrm.data[0] = cos;
        yrm.data[2] = sin;
        yrm.data[8] = -sin;
        yrm.data[10] = cos;
        var xrm = new Mat4();
        cos=Math.cos(x);
        sin=Math.sin(x);
        xrm.data[5] = cos;
        xrm.data[6] = -sin;
        xrm.data[9] = sin;
        xrm.data[10] = cos;
        var out = new Mat4();
        zrm.multiply(yrm);
        out.multiply(zrm);
        out.multiply(xrm);
        this.multiply(out);
    }
    /**
     * 
     * @param {Array} vector 
     */
    scale(vector){
        var s = new Mat4()
        s.data[0] = vector[0];
        s.data[5] = vector[1];
        s.data[10] = vector[2];
        this.multiply(s);
    }
    /**
     * 
     * @param {Array} position 
     * @param {Array} target 
     * @param {Array} up 
     */
    lookAt(position,target,up){
        let x,y,z,out,len
        z = CATS.math.vec3.subtract(position,target)
        if(
            Math.abs(position[0]-target[0])<CATS.math.EPSILON &&
            Math.abs(position[1]-target[1])<CATS.math.EPSILON &&
            Math.abs(position[2]-target[2])<CATS.math.EPSILON
        ){
            this.identity()
        }
        len = 1/Math.hypot(z[0],z[1],z[2])
        z = CATS.math.vec3.multiplyByNumber(z,len)
        x = CATS.math.vec3.cross(up,z)
        y = CATS.math.vec3.cross(z,x)
        out = new Mat4()
        out.data[0] = x[0]
        out.data[1] = y[0]
        out.data[2] = z[0]
        out.data[3] = 0
        out.data[4] = x[1]
        out.data[5] = y[1]
        out.data[6] = z[1]
        out.data[7] = 0
        out.data[8] = x[2]
        out.data[9] = y[2]
        out.data[10] = z[2]
        out.data[11] = 0;
        out.data[12] = -CATS.math.vec3.dot(x,position)
        out.data[13] = -CATS.math.vec3.dot(y,position)
        out.data[14] = -CATS.math.vec3.dot(z,position)
        out.data[15] = 1
        this.multiply(out)
    }
    invert(){
        let a00 = this.data[0]
        let a01 = this.data[1]
        let a02 = this.data[2]
        let a03 = this.data[3]
        let a10 = this.data[4]
        let a11 = this.data[5]
        let a12 = this.data[6]
        let a13 = this.data[7]
        let a20 = this.data[8]
        let a21 = this.data[9]
        let a22 = this.data[10]
        let a23 = this.data[11]
        let a30 = this.data[12]
        let a31 = this.data[13]
        let a32 = this.data[14]
        let a33 = this.data[15]
        let b00 = a00*a11 - a01*a10
        let b01 = a00*a12 - a02*a10
        let b02 = a00*a13 - a03*a10
        let b03 = a01*a12 - a02*a11
        let b04 = a01*a13 - a03*a11
        let b05 = a02*a13 - a03*a12
        let b06 = a20*a31 - a21*a30
        let b07 = a20*a32 - a22*a30
        let b08 = a20*a33 - a23*a30
        let b09 = a21*a32 - a22*a31
        let b10 = a21*a33 - a23*a31
        let b11 = a22*a33 - a23*a32
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if(!det){
            this.identity()
        }
        det = 1.0 / det;
        this.data[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.data[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.data[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.data[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.data[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.data[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.data[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.data[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.data[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.data[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.data[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.data[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.data[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.data[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.data[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.data[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    }
    transpose(){
        this.data[0] = this.data[0]
        this.data[1] = this.data[4]
        this.data[2] = this.data[8]
        this.data[3] = this.data[12]
        this.data[4] = this.data[1]
        this.data[5] = this.data[5]
        this.data[6] = this.data[9]
        this.data[7] = this.data[13]
        this.data[8] = this.data[2]
        this.data[9] = this.data[6]
        this.data[10] = this.data[10]
        this.data[11] = this.data[14]
        this.data[12] = this.data[3]
        this.data[13] = this.data[7]
        this.data[14] = this.data[11]
        this.data[15] = this.data[15]
    }
}
//#endregion