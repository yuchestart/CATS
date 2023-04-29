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
var render,scene,camera,mymesh,mymesh2,mymesh4,mymesh3,mymaterial,mymaterial2,packagedmesh,mylight,mylight2,mytexture;
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
function changeFOV(me){
    scene.setFOV(parseInt(me.value))
    $("fovvalue").id.innerHTML = me.value
}
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id)
    document.onkeydown = function(e){
        keybinds[e.code] = true;
    }
    document.onkeyup = function(e){
        keybinds[e.code] = false;
    }
    scene = new Scene(render)
    scene.bgcolor = CATS.Color("#74d4bf")
    mytexture = new Texture($("amogus").id)
    mymaterial = new TexturedMaterial(mytexture)
    mymaterial2 = new SingleColorMaterial("#00FF00",10)
    mylight = new PointLight([0,0,0],1,1,"#FF0000","#FF0000")
    mymesh = new Plane(0.5,mymaterial)
    mymesh3 = new Plane(0.5,mymaterial)
    mymesh4 = new Cube(1,mymaterial2)
    mymesh2 = new Sphere(2,16,mymaterial2)
    mymesh.scale([1,1,1])
    mymesh.rotate([180,0,0])
    mymesh2.translate([0,0,-10])
    mymesh4.translate([-7,0,0])
    scene.moveCamera([0,2,0])
    scene.addLight(mylight);
    scene.addObject(mymesh)
    scene.addObject(mymesh3)
    scene.addObject(mymesh2)
    scene.addObject(mymesh4)
    scene.setFOV(70)
    function cat(){
        mymesh2.rotate([1,2,1])
        mymesh3.rotate([1,0,0])
        mymesh4.rotate([1,1,0])
        mymesh.rotate([1,0,0])
        if(keybinds.KeyW){
            scene.rotateCamera([-1,0,0])
        }
        if(keybinds.KeyS){
            scene.rotateCamera([1,0,0])
        }
        if(keybinds.KeyA){
            scene.rotateCamera([0,-1,0])
        }
        if(keybinds.KeyD){
            scene.rotateCamera([0,1,0])
        }
    scene.render()

    requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;