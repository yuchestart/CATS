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
    var vshader = new VertexShader(`
attribute vec3 vP;
void main(void){
    gl_Position = vec4(vP,1.0);
}
`,{
    attributes:["vP"],
    uniforms:[]
})
    var fshader = new FragmentShader(
`
void main(void){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`
);
    var shaderProgram = new ShaderProgram(renderer,this.vertexShader,this.fragmentShader);
    var bufferlist = [
        new PositionBuffer(renderer,this.vertexData,"vP"),
        new IndexBuffer(renderer,this.indexData)
    ]
    var bufferlist = buffers.concat(bufferlist);
    
    var renderpackage = new RenderablePackage(
        shaderProgram,
        glDictionary.TRIANGLES,
        bufferlist,
        uniforms,
        0,
        1,
        this.indexData.length
    );
    renderer.drawPackage(renderpackage,glDictionary.ELEMENTS)
}
window.onload = main;