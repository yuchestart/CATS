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
    mymaterial = new SingleColorMaterial("#FF0000")
    mylight = new PointLight([0,3,0],1,2,"#FFFFFF","#FFFFFF")
    mymesh = new Cube(1,mymaterial)
    mymesh.rotate([45,0,0])
    scene.addLight(mylight)
    scene.addObject(mymesh)
    scene.moveCamera([0,1,5])
    
    function cat(){
        mymesh.rotate([1,0,0])
    scene.render()
    requestAnimationFrame(cat)
    }
    cat()
}
window.onload = main;