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
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id)
    scene = new Scene(render)
    scene.bgcolor = CATS.Color("#000000")
    //mymaterial = new SingleColorMaterial("#59a1cd",[0,1,1,2])
    mymaterial = new Material()
    mymesh = new Cube(1,mymaterial)
    mymesh.scale([1,1,1])
    scene.moveCamera([0,0,6])
    scene.addObject(mymesh)
    scene.render()
}
window.onload = main;