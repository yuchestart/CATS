//Main app javascript
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

// HERE BEGINS THE CATS CODE
var render,scene,camera,floor,themesh,mymaterial,elapsed,packagedmesh;
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

// Define the range of the sine wave
let a = 0;
let b = 2;
let a2 = -2;
let b2 = 2;

// Define the frequency and amplitude of the sine wave
let freq = 2;
let amplitude = 1;
let sensitivity = 0.1;
var Rad2Deg = Math.PI / 180;


function CATSmain()
{
    elapsed = 0;
    render = new Renderer($("glCanvas").id);
    scene = new Scene(render);
    scene.bgcolor = CATS.Color("#FFFFFF");
    mymaterial = new SingleColorMaterial("#59a1cd",[0,1,1,2]);
    floor = new Cube(1,mymaterial);
    floor.scale([100,1,100]);
    themesh = new Cube(1, mymaterial);
    themesh.translate([0, 3, 0])
    scene.moveCamera([-1,2,6]);
    var light = new DirectionalLight([-40, 20, -10], [1.0, 0.5, 1.0], 1);
    scene.addLight(light);
    
    function cat()
    {

        scene.render();
        requestAnimationFrame(cat);
    }
    cat();
}
window.onload = CATSmain;
window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    var headerPadding = document.getElementById('headerpadding');
    if (window.scrollY > 0) {
        headerPadding.classList.remove("invisible");
    }
    else {
        if (!headerPadding.classList.contains("invisible"))
            headerPadding.classList.add("invisible");
    }
    header.classList.toggle('sticky', window.scrollY > 0);
});
let canvas = $("glCanvas").id;

canvas.addEventListener("click", function() {
    canvas.requestPointerLock();
    canvas.classList.add("hide-cursor");
    canvas.classList.remove("canvas-blur");
    window.addEventListener("wheel", preventDefaultScroll, { passive: false });
});

window.addEventListener("blur", function() {
    document.exitPointerLock();
    canvas.classList.remove("hide-cursor");

    window.removeEventListener("wheel", preventDefaultScroll);
});

document.addEventListener("mousemove", function(e) {
    if (document.pointerLockElement === canvas) {        
        const dx = e.movementX * sensitivity;
        const dy = e.movementY * sensitivity;
        scene.rotateCamera([dy, dx, 0]);
    }
});

document.addEventListener("keydown", function(e) {
    if (document.pointerLockElement === canvas) {
        switch (e.key) {
            case "w":
                scene.moveCamera([0, 0, -1])
                break;
            case "s":
                scene.moveCamera([0, 0, 1])
                break;
            case "a":
                scene.moveCamera([-1, 0, 0])
                break;
            case "d":
                scene.moveCamera([1, 0, 0]);
                break;
            case "q":
                scene.moveCamera([0, -1, 0]);
                break;
            case "e":
                scene.moveCamera([0, 1, 0]);
                break;
            default:
                break;
        }
    }
})

let dx,dy,dz;
let distance = 0.5;

// Add an event listener to detect pointer lock state changes
document.addEventListener("pointerlockchange", function() {
    if (document.pointerLockElement === canvas) {
        //cool
    } else {
      // Mouse is no longer locked inside the canvas, remove the hide-cursor class
      canvas.classList.remove("hide-cursor");
      canvas.classList.add("canvas-blur");
      window.removeEventListener("wheel", preventDefaultScroll);
    }
});

function preventDefaultScroll(e) {
    e.preventDefault();
}

let objects = [];
let selectedObject = 0;
let objectSelected = false;

const text_positionx = document.getElementById("position-x");
const text_positiony = document.getElementById("position-y");
const text_positionz = document.getElementById("position-z");
const text_rotationx = document.getElementById("rotation-x");
const text_rotationy = document.getElementById("rotation-y");
const text_rotationz = document.getElementById("rotation-z");
text_positionx.value = "0";
text_positiony.value = "0";
text_positionz.value = "0";
text_rotationx.value = "0";
text_rotationy.value = "0";
text_rotationz.value = "0";

text_positionx.disabled = true;
text_positiony.disabled = true;
text_positionz.disabled = true;
text_rotationx.disabled = true;
text_rotationy.disabled = true;
text_rotationz.disabled = true;

function addObjectToScene() {
    var primitiveType = document.getElementById("primitiveType");
    switch (primitiveType.value) {
        case "cube":
            objects[objects.length] = new Cube(1, mymaterial);
            break;
        case "sphere":
            objects[objects.length] = new Sphere(4, 100, mymaterial);
            break;
        case "plane":
            objects[objects.length] = new Plane(1, mymaterial);
            break;
        default:
            objects[objects.length] = new Cube(1, mymaterial);
            break;
    }
    var myList = document.getElementById("option-list");
    const newListItem = document.createElement("li"); // Create a new <li> element
    newListItem.textContent = primitiveType.value.charAt(0).toUpperCase() + primitiveType.value.slice(1); // Set the text content of the <li> element
    newListItem.setAttribute("data-id", objects.length - 1);
    newListItem.setAttribute("onclick", "meshClicked(this);")
    myList.appendChild(newListItem); // Add the new <li> element to the <ul> list
    scene.addObject(objects[objects.length - 1]);
}
function meshClicked(li) {
    // Get all the li elements in the ul
    const lis = document.querySelectorAll("ul li");

    // Remove the "selected" class from all other li elements
    for (let i = 0; i < lis.length; i++) {
        if (lis[i] !== li) {
        lis[i].classList.remove("mesh-selected");
        }
    }

    selectedObject = Number(li.dataset.id);
    objectSelected = true;

    text_positionx.value = objects[selectedObject].transform.position[0].toString();
    text_positiony.value = objects[selectedObject].transform.position[1].toString();
    text_positionz.value = objects[selectedObject].transform.position[2].toString();

    text_rotationx.value = objects[selectedObject].transform.rotation[0].toString();
    text_rotationy.value = objects[selectedObject].transform.rotation[1].toString();
    text_rotationz.value = objects[selectedObject].transform.rotation[2].toString();

    const areas = document.getElementsByClassName("position-attr");
    for (let index = 0; index < areas.length; index++) {
        areas[index].disabled = false;
    }
    
    li.classList.add("mesh-selected");
}
text_positionx.addEventListener("input", () => {
    if (objectSelected && !isNaN(Number(text_positionx.value))) {
        objects[selectedObject].transform.position[0] = Number(text_positionx.value);
        objects[selectedObject].transform.transformStayedSame = false;
    }
});
text_positiony.addEventListener("input", () => {
    if (objectSelected && !isNaN(Number(text_positiony.value))) {
        objects[selectedObject].transform.position[1] = Number(text_positiony.value);
        objects[selectedObject].transform.transformStayedSame = false;
    }
});
text_positionz.addEventListener("input", () => {
    if (objectSelected && !isNaN(Number(text_positionz.value))) {
        objects[selectedObject].transform.position[2] = Number(text_positionz.value);
        objects[selectedObject].transform.transformStayedSame = false;
    }
});
text_rotationx.addEventListener("input", () => {
    if (objectSelected && !isNaN(Number(text_rotationx.value))) {
        objects[selectedObject].transform.rotation[0] = Number(text_rotationx.value);
        objects[selectedObject].transform.transformStayedSame = false;
    }
});
text_rotationy.addEventListener("input", () => {
    if (objectSelected && !isNaN(Number(text_rotationy.value))) {
        objects[selectedObject].transform.rotation[1] = Number(text_rotationy.value);
        objects[selectedObject].transform.transformStayedSame = false;
    }
});
text_rotationz.addEventListener("input", () => {
    if (objectSelected && !isNaN(Number(text_rotationz.value))) {
        objects[selectedObject].transform.rotation[2] = Number(text_rotationz.value);
        objects[selectedObject].transform.transformStayedSame = false;
    }
});
