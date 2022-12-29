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
var render,scene,camera,mymesh,mymaterial;
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    //Too many lines. but at least less than 100.
    render = new Renderer($("emotionalDamage").id);
    render.clear(0.75,0.85,0.8,1.0)
    var vertexShader = new VertexShader(`
precision mediump float;
attribute vec2 vertPosition;
void main(void){
    gl_Position = vec4(vertPosition,1.0);
}
`,{
    attributes:["vertPosition"]
});
    var fragmentShader = new FragmentShader(`
precision mediump float;
void main(void){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`);
    
    var program = new ShaderProgram(render,vertexShader,fragmentShader);
    var posBuffer = new PositionBuffer(render,[
        0.0, 0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0
    ],"vertPosition");
    
}
window.onload = main;