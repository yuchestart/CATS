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
let vertexShader,fragmentShader,shaderProgramInfo,gl;
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
    shaderProgramInfo = ShaderProgram()
    
}
window.onload = main;