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
    $("date").id.innerText = new Date()
    //Too many lines. but at least less than 100.
    render = new Renderer($("emotionalDamage").id,1);
    var vertexShader = new VertexShader(`
precision mediump float;
attribute vec3 vertPosition;
attribute vec3 vertColor;
uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 fragColor;
void main(void){
    gl_Position = projectionMatrix*viewMatrix*worldMatrix*vec4(vertPosition,1.0);
    fragColor = vertColor;
}
`);
    var fragmentShader = new FragmentShader(`
precision mediump float;
varying vec3 fragColor;
void main(void){
    gl_FragColor = vec4(fragColor,1);
}
`);
    
    var program = new ShaderProgram(render,vertexShader,fragmentShader);
    var posBuffer = new PositionBuffer(render,[
        0.0,1.0,0.0,
        1.0,-1.0,0.0,
        -1.0,-1.0,0.0
    ],"vertPosition");
    var colorBuffer = new Buffer(render,[
        1.0,0.0,0.0,
        0.0,1.0,0.0,
        0.0,0.0,1.0,
    ],"vertColor",null,glDictionary.ATTRIBUTE,[
        3,
        render.gl.FLOAT,
        render.gl.FALSE,
        3*Float32Array.BYTES_PER_ELEMENT,
        0
    ]);
    var indexBuffer = new IndexBuffer(render,[
        2,1,0
    ])
    var worldMatrix = new Mat4();
        render.clear(0.75,0.85,0.8,1.0)
    var viewMatrix = new Mat4();
    var projectionMatrix = new Mat4();
    worldMatrix.rotate([45,45,45])
    viewMatrix.lookAt([0,0,5],[0,0,0],[0,1,0]);
    projectionMatrix.perspective(45,render.aspect,glMath.EPSILON,100)
    var renderPackage = new RenderablePackage(program,
        glDictionary.ELEMENTS,[posBuffer,colorBuffer,indexBuffer],[worldMatrix.convertToUniform(render,"worldMatrix"),
    viewMatrix.convertToUniform(render,"viewMatrix"),
    projectionMatrix.convertToUniform(render,"projectionMatrix")],0,true,3);
    render.drawPackage(renderPackage,glDictionary.TRIANGLES)
}
window.onload = main;