import { Renderer } from "./renderer.js";
export class VertexShader{
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

export class FragmentShader{
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

export class ShaderProgram{
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
