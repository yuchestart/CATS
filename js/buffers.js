import { CORE } from "./core.js"
//BUFFERS
//#region
export class Buffer{
    /**
     * A WebGL buffer template used internally in CATS.
     * This object is not recommended for general purpose use.
     * @param {Renderer} renderer 
     * @param {Array} data 
     * @param {Float32Array|Uint16Array} dataType 
     * @param {Object} params 
     * @param {Number} usage 
     */
    constructor(renderer,data,dataType,params,usage){
        if(!params.usageType){
            this.usageType = CORE.enum.ARRAY_BUFFER;
        }
        if(!params.type){
            this.type = CORE.enum.ATTRIBUTE
        } else {
            this.type = params.type
        }
        const usageTypeDict = {};
        usageTypeDict[CORE.enum.ARRAY_BUFFER] = renderer.gl.ARRAY_BUFFER
        usageTypeDict[CORE.enum.ELEMENT_ARRAY_BUFFER] = renderer.gl.ELEMENT_ARRAY_BUFFER
        this.renderer = renderer;
        this.data = data;
        this.attribute = params.attribute;
        this.usageType = usageTypeDict[params.usageType]
        const gl = this.renderer.gl;
        const newBuffer = gl.createBuffer();
        this.params = params;
        this.dataType = dataType?dataType:Float32Array
        this.usage = usage?usage:gl.STATIC_DRAW
        gl.bindBuffer(this.usageType,newBuffer);
        gl.bufferData(this.usageType,
            new this.dataType(data),
            this.usage
        );
        gl.bindBuffer(this.usageType,null);
        this.buffer = newBuffer;
    }
    setValue(data){
        const gl = this.renderer.gl;
        gl.bindBuffer(this.usageType,this.buffer)
        gl.bufferData(this.usageType,
            new this.dataType(data),
            this.usage
        );
        gl.bindBuffer(this.usageType,null);
    }
    enableForProgram(program){
        if(this.type == CORE.enum.ATTRIBUTE){
            let location = this.renderer.gl.getAttribLocation(program,this.attribute)
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
export class PositionBuffer extends Buffer{
    /**
     * An WebGL Buffer Object used internally in CATS.
     * This object is not recommended for general purpose use.
     * @param {Renderer} render 
     * @param {Array} data 
     * @param {String} attribute 
     */
    constructor(render,data,attribute){
        /*
        super(render,data,attribute,null,CORE.enum.ATTRIBUTE,[
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
            usageType:CORE.enum.ARRAY_BUFFER,
            type:CORE.enum.ATTRIBUTE,
            attribute:attribute
        },)
    }
}
export class IndexBuffer extends Buffer{
    constructor(render,data){
        /*
        super(render,data,"",null,CORE.enum.NON_ATTRIBUTE,[],render.gl.ELEMENT_ARRAY_BUFFER,Uint16Array);
        */
        super(render,data,Uint16Array,{
            usageType:CORE.enum.ELEMENT_ARRAY_BUFFER,
            type:CORE.enum.NON_ATTRIBUTE
        })
    }
}
export class TextureCoordinateBuffer extends Buffer{
    constructor(render,data,attribute){
        super(render,data,Float32Array,{
            vertexAttribParams:{
                numberOfComponents:2,
                type:render.gl.FLOAT,
                normalize:render.gl.FALSE,
                stride:2*Float32Array.BYTES_PER_ELEMENT,
                offset:0
            },
            usageType:CORE.enum.ARRAY_BUFFER,
            type:CORE.enum.ATTRIBUTE,
            attribute:attribute
        })
    }
}
export class Texture2DBuffer{
    /**
     * Creates a texture buffer object. Used internally in CATS.
     * @param {Renderer} renderer 
     * @param {Texture} texture
     */
    constructor(renderer,texture=null){
        this.renderer = renderer;
        const gl = this.renderer.gl;
        const textr = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,textr)
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture)
        gl.bindTexture(gl.TEXTURE_2D,null)
        this.texture = textr;
    }
    enableForProgram(){
       this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D,this.texture)
    }
}
export class Texture{
    /**
     * Converts an image source URL to a usable image.
     */
    constructor(data){
        if(data instanceof String){
            let myimage = new Image();
            myimage.src=data;
            return myimage;
        } else if(da){
            return data;
        }
    }
}
export class Framebuffer{
    /**
     * Create a new Framebuffer object.
     * @param {Renderer} renderer Renderer object
     */
    constructor(renderer){
        const gl = renderer.gl;
        this.renderer = renderer;
        this.fb = gl.createFramebuffer();
        if(this.fb===null)
            throw new Error("Framebuffer initialization failed.")
    }
    /**
     * 
     */
    attachObject(){
        
    }
    bind(){
        const gl = this.renderer.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.fb);
    }
    /**
     * WARNING: This method unbinds all framebuffers, even if this one isn't currently bound.
     */
    unbind(){
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    }

}
//#endregion
//Uniforms
//#region
export class Uniform4x4Matrix{
    constructor(render,matrix,attribute){
        this.matrix = matrix;
        this.attribute = attribute;
        this.render = render;
        this.tag = CORE.enum.UNIFORM;
    }
    enableForProgram(program){
        this.render.gl.uniformMatrix4fv(this.render.gl.getUniformLocation(program,this.attribute),
        this.render.gl.FALSE,
        this.matrix.data)
    }
}
export class UniformVector3{
    constructor(render,vector,attribute){
        this.vector = vector;
        this.attribute = attribute;
        this.render = render;
        this.tag = CORE.enum.UNIFORM;
    }
    enableForProgram(program){
        this.render.gl.uniform3fv(this.render.gl.getUniformLocation(program,this.attribute),new Float32Array(this.vector));
    }
}
export class UniformVector4{
    constructor(render,vector,attribute){
        this.vector = vector;
        this.attribute = attribute;
        this.render = render;
        this.tag = CORE.enum.UNIFORM;
    }
    enableForProgram(program){
        this.render.gl.uniform4fv(this.render.gl.getUniformLocation(program,this.attribute),new Float32Array(this.vector));
    }
}
export class UniformFloat{
    constructor(render,value,attribute){
        this.value = value;
        this.attribute = attribute;
        this.render = render;
        this.tag = CORE.enum.UNIFORM;
    }
    enableForProgram(program){
        this.render.gl.uniform1f(this.render.gl.getUniformLocation(program,this.attribute),this.value)
    }
}
//#endregion
