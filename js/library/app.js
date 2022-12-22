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
let vertexShader,fragmentShader,shaderProgramInfo,gl,positionBuffer,bufferList;
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    render = new Renderer($("emotionalDamage").id);
    render.clear(0.0,0.0,0.0,1.0);
    gl = render.gl;
    vertexShader = new VertexShader(`
        attribute vec4 aVertexPosition;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main(){
            gl_Position = uProjectionMatrix * uViewMatrix * aVertexPosition;
        }
    `,{
        attributes:["aVertexPosition"],
        uniforms:["uViewMatrix","uProjectionMatrix"]
    });
    fragmentShader = new FragmentShader(`
    void main(){
        gl_FragColor = vec4(1.0,1.0,1.0,0.5);
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
    bufferList = new BufferList(["aVertexPosition"],[positionBuffer]);
    const projectionMatrix = create();
    perspective(projectionMatrix,(45*Math.PI)/180,render.canvas.clientWidth/render.canvas.clientHeight,0.1,100.0);
    const viewMatrix = create();
    translate(viewMatrix,viewMatrix,[-0.0,0.0,-6.0])
    const uniformList = new UniformList([new UniformMAT4Matrix(
        render,
        projectionMatrix,
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