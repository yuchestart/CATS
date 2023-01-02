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
//Code has been reset
function main(){
    $("date").id.innerText = new Date()
    //Wow now that's a lot of code gone.
    render = new Renderer($("emotionalDamage").id);
    scene = new Scene(render)
    mymaterial = new SingleColorMaterial([0,255,0,0.4])
    mymesh = new Cube(1,mymaterial)
    scene.setFOV(70)
    scene.addObject(mymesh);
    document.onkeydown = function(e){
        keybinds[e.code] = true;
    }
    document.onkeyup = function(e){
        keybinds[e.code] = false;
    }
    function cat(){
        var forward=keybinds.KeyW,
        back=keybinds.KeyS,
        left=keybinds.KeyA,
        right=keybinds.KeyD,
        up=keybinds.KeyQ,
        down=keybinds.KeyE
        if(forward){
            scene.moveCamera([0,0,-0.1])
        } else if(back){
            scene.moveCamera([0,0,0.1])
        }
        if(left){
            scene.moveCamera([-0.1,0,0])
        } else if(right){
            scene.moveCamera([0.1,0,0])
        }
        if(up){
            scene.moveCamera([0,0.1,0])
        } else if(down){
            scene.moveCamera([0,-0.1,0])
        }
        scene.render()
        requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;