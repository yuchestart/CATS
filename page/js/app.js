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

async function preload(callback){
    await CATS.loadMesh("./models/susan.json","vertices","faces","normals",["texturecoords",0],["meshes",0],$("amogus").id).then((data)=>{
        mymesh=data;
        console.log(mymesh.texCoords);
        mymesh.flipTCoordinate()
        console.log(mymesh.texCoords)
        var mymaterial = new TexturedMaterial($("amogus").id)
        mymesh.setMaterial(mymaterial)
        console.log(data)
    })
    callback()
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
    scene.setBackground("#000000")
    mymaterial = new SingleColorMaterial("#FF0000",0,CATS.enum.PHONG_LIGHTING)
    mylight = new DirectionalLight([0,0],1)
    mylight2 = new AmbientLight(20,"#FFFFFF")
    mymesh2 = new Cube(1,mymaterial)
    //mymaterial = new Texture
    mymesh.rotate([0,0,0])
    //mymesh2.translate([0,6,0])
    scene.addLight(mylight)
    scene.addLight(mylight2)
    //var mymeshid = scene.addObject(mymesh)
    //var mymeshid2 = scene.addObject(mymesh2)
    scene.moveCamera([0, 0, 3])
    //scene.rotateCamera([-56, -168, 0])
    scene.addObject(mymesh)
    //scene.objects[mymeshid2].rotate([1,1,0])
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
window.onload = function(){
    preload(main);
};