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
var render,scene,camera,mymesh;
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    //Too many lines. but at least less than 100.
    render = new Renderer($("emotionalDamage").id);
    camera = new Camera([0,0,-2],[0,0,1],45,glMath.EPSILON,100)
    scene = new Scene(render,camera,"#000000");
    mymesh = new Mesh([0.5,0.5,0.5,-0.5,-0.5,-0.5],[0,1,2],new BasicColorMaterial([1,0,0,1],false))
    scene.addObjectToScene(mymesh);
    scene.render();
    
}
window.onload = main;