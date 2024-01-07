//APP
import CATS from "../../js/main.js";

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
let render,scene,camera,mymesh,mymesh2,mymesh4,mymesh3,mymaterial,mymaterial2,packagedmesh,mylight,mylight2,mytexture,tick;
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
    ArrowLeft:false,
    Space:false
}
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function changeFOV(me){
    scene.setFOV(parseInt(me.value))
    $("fovvalue").id.innerHTML = me.value
}

function main(){
    //mathdebug()
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new CATS.Renderer($("emotionalDamage").id)
    document.onkeydown = function(e){
        keybinds[e.code] = true;
    }
    document.onkeyup = function(e){
        keybinds[e.code] = false;
    }
    scene = new CATS.Scene(render)
    scene.setBackground("#000000")
    mymaterial = new CATS.Material()
    
    mymesh = new CATS.Cube(1,mymaterial)
    mylight = new CATS.PointLight([0,10,0],100,10,"#FFFFFF","#ffffff")
    mylight = new CATS.DirectionalLight([180,0],"#FFFFFF")
    mylight2 = new CATS.AmbientLight(20,"#FFFFFF")
    mymesh.translate([0,0,-5])
    mymesh.rotate([0,0,0])
    scene.addLight(mylight)
    scene.addLight(mylight2)
    
    var mymeshid = scene.addObject(mymesh)
    //var mymeshid2 = scene.addObject(mymesh2)
    //scene.objects[mymeshid2].translate([0,2,0])
    //scene.objects[mymeshid].translate([0,-2,0])
    
    scene.moveCamera([0,0,0])
    tick = 0
    function cat(){
        //tick+=0.01
        //scene.objects[mymeshid].setScale([Math.sin(tick),1,1])
       //scene.objects[mymeshid].rotate([0,0,3])
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
    if(keybinds.Space){
        
    }
    //requestAnimationFrame(cat)

    }
    cat()
}
window.onload = function(){
    
    
    main()
};