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
var render,scene,camera,mymesh,mymaterial,packagedmesh;
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id,1);
    scene = new Scene(render)
    mymaterial = new MultiColorMaterial(["#FF0000","#00FF00","#0000FF"])
    mymesh = new Mesh([0,1,0,-1,0,0,1,0,0],[0,1,2],mymaterial);
    mymesh.translate([0,-0.5,0])
    mymesh.rotate([0,45,0])
    scene.rotateCamera([90,0,0])
    scene.moveCamera([0,0,2])
    scene.setFOV(70)
    scene.addObject(mymesh);
    scene.render()
}
window.onload = main;