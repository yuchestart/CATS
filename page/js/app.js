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
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id)
    scene = new Scene(render)
    scene.bgcolor = CATS.Color("#FFFFFF")
    mymaterial = new SingleColorMaterial("#59a1cd")
    mylight = new PointLight([2,3,0],"#FFFFFF",2)
    mymesh = new Sphere(1,16,mymaterial)
    mymesh2 = new Sphere(1,16,mymaterial)
    mymesh2.translate([3,-5,0])
    mymesh.scale([1,1,1])
    mymesh.rotate([180,0,0])
    scene.moveCamera([0,3,4])
    scene.addLight(mylight);
    scene.rotateCamera([45,0,0])
    scene.addObject(mymesh)
    scene.addObject(mymesh2)
    function cat(){
    scene.render()
    //requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;