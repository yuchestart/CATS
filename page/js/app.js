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
    camera = new Camera([0,0,-2],[0,0,0],45,glMath.EPSILON,100)
    scene = new Scene(render,camera,"#00FF00");
    mymaterial = new SingleColorMaterial("1.0,0.0,0.0,1.0");
    
    
}
window.onload = main;