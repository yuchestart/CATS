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
 * Contains important functions and values.
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

        } else if(color instanceof String){
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
     * Draws a renderable data package.
     * @param {RenderablePackage} package The package to draw
     * @param {Number} renderType The way the package is rendered, for example CATS.enum.TRIANGLES
     */
    drawPackage(renderPackage){
        var renderTypes = {
            0:this.gl.TRIANGLE_STRIP,
            1:this.gl.TRIANGLES,
            2:this.gl.POINTS,
            3:this.gl.LINES
        }
        if(!renderType){
            renderType = renderTypes[renderPackage.renderType];
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
        switch(renderPackage.drawingMethod){
            case CATS.enum.ELEMENTS:
                this.gl.drawElements(renderType,renderPackage.indexAmount,this.gl.UNSIGNED_SHORT,renderPackage.offset);
                break;
            case CATS.enum.ARRAYS:
                this.gl.drawArrays(renderType,0,renderPackage.indexAmount)
                break;
        }
    }
}
//#endregion
//-----------SCENE-----------
//What the user interacts with the most.
//Makes easier use of the library
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
                this.normals.push(normal,normal,normal)
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
        }
        var builtMaterial = this.material.build(renderer,this,scene);
        var shaderProgram = builtMaterial.shaderProgram;
        var parameters = builtMaterial.parameters;
        var newparameter;
        for(var i=0; i<parameters.length; i++){
            newparameter = new parameters.type(renderer,parameters.value,parameters.name);
            parameters[i] = newparameter;
        }
        var positionBuffer = new PositionBuffer(renderer,this.vertices,"vP");
        var indexBuffer = new IndexBuffer(renderer,this.indices);
        var normalBuffer = new PositionBuffer(renderer,this.vertices,"vN");
        var transformUniform = new Uniform4x4Matrix(renderer,this.transform.transformMatrix,"wM");
        var viewUniform = new Uniform4x4Matrix(renderer,viewMatrix,"vM");
        var projectionUniform = new Uniform4x4Matrix(renderer,projectionMatrix,"pM");
        var shaderInput = [positionBuffer,indexBuffer,normalBuffer,transformUniform,viewUniform,projectionUniform];
        shaderInput.concat(parameters);
        //constructor(shaderProgram,shaderInputs,drawingMethod,renderType,params)
        var package = new RenderablePackage(shaderProgram,shaderInput,CATS.enum.ELEMENTS,CATS.enum.TRIANGLES,)
        return package;
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
        this.source = source.replaceAll(/\n|\r|\t/gi,"");
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
        this.source = source.replaceAll(/\n|\r|\t/gi,"");
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
        }[this.usageType]
        const gl = this.renderer.gl;
        const newBuffer = gl.createBuffer();
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
                params.vertexAttribParams.numberOfComponents,
                params.vertexAttribParams.type,
                params.vertexAttribParams.normalize,
                params.vertexAttribParams.stride,
                params.vertexAttribParams.offset
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
    }
    enableForProgram(program){
        this.render.gl.uniformMatrix4fv(this.render.gl.getUniformLocation(program,this.attribute),
        this.render.gl.FALSE,
        this.matrix)
    }
}
class UniformVector3{
    constructor(render,vector,attribute){
        this.vector = vector;
        this.attribute = attribute;
        this.render = render;
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
        this.shaaerInputs = shaderInputs;
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

class Material{
    /**
     * The basic material template. It allows you to write your own materials.
     * Defaults to a magenta material with no lighting
     * @param {Array} parameters 
     */
    constructor(parameters,buildFunction){
        this.lastCompiled = false;
        this.compiled = null;
        this.parameters = parameters;
        this.params = params;
        this.build = buildFunction?function(renderer,mesh,scene){
            buildFunction(renderer,mesh,scene,this);
        }:function(renderer,mesh,scene){
            let vertexShader = new VertexShader(`
            attribute vec3 vP;
            attribute vec3 vN;
            uniform mat4 wM;
            uniform mat4 vM;
            uniform mat4 pM;
            void main(void){
                gl_Position = pM*vM*wM*vec4(vP,1.0);
            }
            `);
            let fragmentShader = new FragmentShader(`
            void main(void){
                gl_FragColor = vec4(1.0,0.0,1.0,1.0);
            }
            `);
            let shaderProgram = new ShaderProgram(renderer,vertexShader,fragmentShader);
            this.lastCompiled = true;
            return {
                shaderProgram:shaderProgram,
                parameters:[]
            };
        };
    }
}
class SingleColorMaterial extends Material{
    constructor(color,params){
        /**
         * A single colored material with togglable lighting.
         * @param {Renderer} render 
         * @param {Mesh} mesh 
         * @param {Scene} scene 
         * @param {Material} material 
         * @returns
         */
        function buildMaterial(render,mesh,scene,material){
            if(!material.lastCompiled){
                let vertexShaderSource = `
                #define MAXLIGHTSOURCES ${scene.lighting.maxLightSources}
                attribute vec3 vP;
                attribute vec3 vN;
                uniform mat4 wM;
                uniform mat4 vM;
                uniform mat4 pM;
                varying vec3 fN;
                void main(void){
                    gl_Position = pM*vM*wM*vec4(vP,1.0);
                    fN = vN;
                }
                `
                            let fragmentShaderSource = `
                #define MAXLIGHTSOURCES ${scene.lighting.maxLightSources}
                varying vec3 fN;
                uniform vec3 inverseLightDirection;
                uniform vec4 objectColor;
                void main(void){
                    vec3 normal = normalize(fN);
                    float light = dot(normal,inverseLightDirection)
                    gl_FragColor = objectColor;
                    gl_FragColor.rgb *= light;
                }
                            `
                let vertexShader = new VertexShader(vertexShaderSource);
                let fragmentShader = new FragmentShader(fragmentShaderSource);
                let shaderProgram = new ShaderProgram(render,vertexShader,fragmentShader);
                this.lastCompiled = true;
                material.compiled = {
                    shaderProgram:shaderProgram,
                    parameters:[{
                        type:UniformVector3,
                        name:"inverseLightDirection",
                        value:material.params[1]
                    },
                    {
                        type:UniformVector4,
                        name:"objectColor",
                        value:material.params[0]
                    }
                ],
                }
                return material.compiled;
            } else {
                return material.compiled;
            }
        }
        super([color,params],buildMaterial);
    }
}
/*
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
#define MAXLIGHTSOURCES ${scene.lighting.maxLightSources}
attribute vec3 vP;
attribute vec3 vN;
uniform mat4 wM;
uniform mat4 vM;
uniform mat4 pM;
varying vec3 fN;
void main(void){
    gl_Position = pM*vM*wM*vec4(vP,1.0);
    fN = vN;
}
`
            let fragmentShaderSource = `
#define MAXLIGHTSOURCES ${scene.lighting.maxLightSources}
varying vec3 fN;
uniform vec3 inverseLightDirection; //THIS IS ONLY A PROTOTYPE
uniform vec4 objectColor;
void main(void){
    vec3 normal = normalize(fN);
    float light = dot(normal,inverseLightDirection)
    gl_FragColor = objectColor;
    gl_FragColor.rgb *= light;
}
            `
            let vertexShader = new VertexShader(vertexShaderSource);
            let fragmentShader = new FragmentShader(fragmentShaderSource);
            let shaderProgram = new ShaderProgram(render,vertexShader,fragmentShader);
            this.lastCompiled = true;
            
        } else {
            return this.compiled;
        }
    }
}*/
//#endregion