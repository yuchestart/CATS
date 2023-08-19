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
    scene.bgcolor = [0,0,0,0]
    mymaterial = new SingleColorMaterial("#FF0000",0,CATS.enum.PHONG_LIGHTING)
    mylight = new DirectionalLight([0,0],1)
    mylight2 = new AmbientLight(50,"#FFFFFF")
    mymesh2 = new Plane(10,mymaterial)
    //mymesh.rotate([180,0,0])
    //mymesh2.translate([0,6,0])
    scene.addLight(mylight)
    //scene.addLight(mylight2)
    //var mymeshid = scene.addObject(mymesh)
    //var mymeshid2 = scene.addObject(mymesh2)
    scene.moveCamera([0, 4.2, 10.9])
    
    function cat(){
        //scene.objects[mymeshid].rotate([1,0,0])
    scene.render()
    if(keybinds.KeyW){
        scene.moveCamera([0,0,-0.1])
    } else if(keybinds.KeyS){
        scene.moveCamera([0,0,0.1])
    }
    if(keybinds.KeyA){
        scene.moveCamera([-0.1,0,0])
    } else if(keybinds.KeyD){
        scene.moveCamera([0.1,0,0])
    }
    if(keybinds.KeyQ){
        scene.moveCamera([0,0.1,0])
    } else if(keybinds.KeyE){
        scene.moveCamera([0,-0.1,0])
    }
    if(keybinds.ArrowUp){
        scene.rotateCamera([-2,0,0])
    } else if(keybinds.ArrowDown){
        scene.rotateCamera([2,0,0])
    }
    if(keybinds.ArrowLeft){
        scene.rotateCamera([0,-2,0])
    } else if(keybinds.ArrowRight){
        scene.rotateCamera([0,2,0])
    }
    requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;