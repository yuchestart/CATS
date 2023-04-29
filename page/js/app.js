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
var render,scene,camera,mymesh,mymesh2,mymaterial,mymaterial2,packagedmesh,mylight,mylight2,mytexture;
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
    $("emotionalDamage").id.onkeydown = function(e){
        keybinds[e.code] = true;
    }
    $("emotionalDamage").id.onkeydown = function(e){
        keybinds[e.code] = false;
    }
    scene = new Scene(render)
    scene.bgcolor = CATS.Color("#74d4bf")
    mytexture = new Texture($("amogus").id)
    mymaterial = new TexturedMaterial(mytexture)
    mymaterial2 = new SingleColorMaterial("#FF0000")
    mylight = new PointLight([0,0,0],1,0.5,"#FF0000","#FF0000")
    mymesh = new Plane(1,mymaterial)
    mymesh2 = new Cube(1,mymaterial2)
    mymesh.scale([1,1,1])
    mymesh.rotate([180,0,0])
    mymesh2.translate([0,0,-10])
    scene.moveCamera([0,2,0])
    scene.addLight(mylight);
    scene.addObject(mymesh)
    scene.addObject(mymesh2)
    scene.setFOV(45)
    function cat(){
    scene.render()

    requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;