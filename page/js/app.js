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
var render,scene,camera,mymesh,mymesh2,mymaterial,packagedmesh,mylight,mylight2;
var keybinds = {
    KeyW:false,
    KeyA:false,
    KeyS:false,
    KeyD:false,
    KeyQ:false,
    KeyE:false,
    ArrowUp:false,
    ArrowDown:false,
    ArrowRight:false,
    ArrowLeft:false
}
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function updateShininess(){
    $("shininessvalue").id.innerText = $("shininess").id.value;
    mymaterial.shininess = parseInt($("shininess").id.value)
}
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id)
    scene = new Scene(render)
    scene.bgcolor = CATS.Color("#FFFFFF")
    mymaterial = new SingleColorMaterial("#59a1cd",70)
    mylight = new PointLight([0,0,0],"#FFFFFF",8,2)
    mymesh2 = new Cube(1,mymaterial)
    mymesh = new Sphere(1,90,mymaterial)
    mymesh2.translate([2,0,1])
    mymesh.translate([-0.5,0,-4])
    mymesh.scale([1,1,1])
    //mymesh.rotate([180,0,0])
    scene.moveCamera([-4,0,4])
    scene.addLight(mylight);
    scene.rotateCamera([0,45,0])
    scene.addObject(mymesh)
    scene.addObject(mymesh2)
    scene.setFOV(45)
    function cat(){
    scene.render()
    mymaterial.resetBuild()
    requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;