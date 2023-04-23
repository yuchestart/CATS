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
function updateBrightness(){
    $("brightnessvalue").id.innerText = $("brightness").id.value;
    mylight.range = parseFloat($("brightness").id.value)
}
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id)
    scene = new Scene(render)
    scene.bgcolor = CATS.Color("#FFFFFF")
    mymaterial = new SingleColorMaterial("#51FF51",70)
    mylight = new PointLight([0,0,0],"#FF9999",2,1.1)
    //mylight2 = new PointLight([0,-4,0],"#FF0000",8,2)
    mymesh2 = new Cube(1,mymaterial)
    mymesh = new Sphere(1,90,mymaterial)
    mymesh2.translate([10,0,1])
    mymesh.translate([-0.6,2,-4])
    mymesh.scale([1,1,1])
    //mymesh.rotate([180,0,0])
    scene.moveCamera([-4,0,4])
    scene.addLight(mylight);
    //scene.addLight(mylight2)
    scene.rotateCamera([0,70,0])
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