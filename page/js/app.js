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
var render,scene,camera,mymesh,mymaterial,packagedmesh,mylight,mylight2;
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
    mymaterial = new Material("#59a1cd")
    mymesh = new Cube(1,mymaterial)
    mymesh.scale([1,1,1])
    scene.moveCamera([0,0,4])
    scene.rotateCamera([0,0,45])
    scene.addObject(mymesh)
    function cat(){
    mymesh.rotate([1,1,0])
    scene.render()
    //requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;