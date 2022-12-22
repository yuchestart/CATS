//----------Misc----------
//#region 
//Yeah I'm pretty sure this is useless.
const glMath = {
    quotes:[
        "Hey! That's not very nice!"
    ]
}
//#endregion
/**
 * A 4x4 matrix for WebGL.
 * Calling the constructor will create a 4x4 identity matrix.
 */
class Mat4{
    constructor(){
        this.data = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    }
}