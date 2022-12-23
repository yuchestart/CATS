//APP
function $(name,parent){
    return parent?{
        tag:parent.getElementsByTagName(name),
        class:parent.getElementsByClassName(name)
    } : {
        id:document.getElementById(name),
        tag:document.getElementsByTagName(name),
        class:document.getElementsByClassName(name)
    }
}
var render;
let vertexShader,fragmentShader,shaderProgramInfo,gl,positionBuffer,bufferList,colorBuffer;
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    //Too many lines. but at least less than 100.
    render = new Renderer($("emotionalDamage").id);
    render.clear(0.0,0.0,0.0,1.0);
    gl = render.gl;
    vertexShader = new VertexShader(`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying lowp vec4 vColor;
        void main(void){
            gl_Position = uProjectionMatrix * uViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `,{
        attributes:["aVertexPosition","aVertexColor"],
        uniforms:["uViewMatrix","uProjectionMatrix"]
    });
    fragmentShader = new FragmentShader(`
    varying lowp vec4 vColor;
    void main(void){
        gl_FragColor = vColor;
    }
    `,{});
    shaderProgramInfo = new ShaderProgram(render,vertexShader,fragmentShader);
    positionBuffer = new Buffer(shaderProgramInfo,render,[1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0],gl.STATIC_DRAW,glDictionary.ATTRIBUTE,
        [
            2,
            render.gl.FLOAT,
            false,
            0,
            0
        ]);
    colorBuffer = new Buffer(shaderProgramInfo,render,[1.0,1.0,1.0,1.0, 1.0,0.0,0.0,1.0,0.0,1.0,0.0,1.0,0.0,0.0,1.0,1.0,],gl.STATIC_DRAW,glDictionary.ATTRIBUTE,[
        4,
        render.gl.FLOAT,
        false,
        0,
        0,
    ])
    bufferList = new BufferList(["aVertexPosition","aVertexColor"],[positionBuffer,colorBuffer]);
    const projectionMatrix = new Mat4();
    projectionMatrix.perspective(45,render.canvas.clientWidth/render.canvas.clientHeight,0.01,100) 
    const viewMatrix = create();
    translate(viewMatrix,viewMatrix,[-0.0,0.0,-6.0])
    const uniformList = new UniformList([new UniformMAT4Matrix(
        render,
        projectionMatrix.data,
        "uProjectionMatrix",
        shaderProgramInfo
    ),new UniformMAT4Matrix(
        render,
        viewMatrix,
        "uViewMatrix",
        shaderProgramInfo
    )]);
    render.drawProgram(shaderProgramInfo,bufferList,uniformList,4)
}
window.onload = main;