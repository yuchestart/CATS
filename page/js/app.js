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
var render,scene;
//Hopefully this code will be less than 100 lines with the library.
//Code has been reset
function main(){
    //Too many lines. but at least less than 100.
    render = new Renderer($("emotionalDamage").id);
    scene = new Scene();
    r = 0
    function mainloop(){
        r+=1
        render.clear(0.0,0.0,0.0,1.0);
        
        requestAnimationFrame(mainloop);
    }
    mainloop()
}
window.onload = main;