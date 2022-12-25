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
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    //Too many lines. but at least less than 100.
    render = new Renderer($("emotionalDamage").id);
    r = 0
    function mainloop(){
        r+=1
        render.clear(0.0,0.0,0.0,1.0);
    drawSomething(0.0,0.0,-6.0,r);
    drawSomething(1.0,0.0,-7.0,r);//Yep my brain is too big.
        requestAnimationFrame(mainloop);
    }
    mainloop()
}
function drawSomething(a,b,c,d){
    const gl = render.gl;
    const vertexShader = new VertexShader(`
        attribute vec3 vertexPosition;
        void main(void){
            gl_Position = vec4(vertexPosition,1.0);
        }
    `);
    const fragmetnShader = new FragmentShader(`
        void main(void){
            gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        }
    `);
    const mesh = new Mesh([
        -0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,0.5,-0.5,
        -0.5,0.5,-0.5,
        -0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,0.5,0.5,
        -0.5,0.5,0.5,])
}
window.onload = main;