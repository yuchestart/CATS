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
    var render = new Renderer($("emotionalDamage").id);
    var scene = new Scene(render)
    var mymaterial = new MultiColorMaterial([
        "#FF0000",
        "#FF0000",
        "#FF0000",
        "#FF0000",
        "#00FF00",
        "#00FF00",
        "#00FF00",
        "#00FF00",
        "#0000FF",
        "#0000FF",
        "#0000FF",
        "#0000FF",
        "#FFFF00",
        "#FFFF00",
        "#FFFF00",
        "#FFFF00",
        "#00FFFF",
        "#00FFFF",
        "#00FFFF",
        "#00FFFF",
        "#FF00FF",
        "#FF00FF",
        "#FF00FF",
        "#FF00FF"]);
    var mymaterial2 = new SingleColorMaterial("#CCFFCC")
    var mymesh = new Cube(1,mymaterial)
    var mymesh2 = new Sphere(1,10,mymaterial2)
    mymesh2.translate([5,0,0])
    console.log(mymesh2)
    scene.setFOV(70)
    scene.moveCamera([0,0,5])
    scene.addObject(mymesh);
    scene.addObject(mymesh2);
    document.onkeydown = function(e){
        keybinds[e.code] = true;
    }
    document.onkeyup = function(e){
        keybinds[e.code] = false;
    }
    ag = 0
    function cat(){
        ag++;
        mymesh.rotate([1,1,1])
        mymesh.scale([2+Math.sin(
            glMath.toRadians(ag)
        ),2+Math.sin(
            glMath.toRadians(ag)
        ),2+Math.sin(
            glMath.toRadians(ag)
        )])
        var forward=keybinds.KeyW,
        back=keybinds.KeyS,
        left=keybinds.KeyA,
        right=keybinds.KeyD,
        up=keybinds.KeyQ,
        down=keybinds.KeyE
        var panleft = keybinds.ArrowLeft,
        panright = keybinds.ArrowRight,
        panup = keybinds.ArrowUp,
        pandown = keybinds.ArrowDown
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
        if(panleft){
            scene.rotateCamera([0,1,0])
        } else if(panright){
            scene.rotateCamera([0,-1,0])
        }
        if(panup){
            scene.rotateCamera([1,0,0])
        } else if(pandown){
            scene.rotateCamera([-1,0,0])
        }
        scene.render()
        requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;