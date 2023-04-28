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
var render,scene,camera,mymesh,mymesh2,mymaterial,packagedmesh,mylight,mylight2,mytexture;
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
    scene.bgcolor = CATS.Color("#74d4bf")
    mytexture = new Texture($("amogus").id)
    mymaterial = new TexturedMaterial(mytexture)
    mylight = new PointLight([0,0,6],1,1,"#FF0000","#FF0000")
    mymesh = new Cube(1,mymaterial)
    mymesh.scale([1,1,1])
    //mymesh.rotate([180,0,0])
    scene.moveCamera([0,0,6])
    scene.addLight(mylight);
    scene.addObject(mymesh)
    scene.setFOV(45)
    function cat(){
        mymesh.rotate([1,1,0])
    scene.render()
    requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;