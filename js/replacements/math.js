/**
 * Out with the old in with the new
 * 
 * This math library will be included with the WebGL Library, replacing glmatrix
 */

//----------Misc----------
//#region 
//Yeah I'm pretty sure this is useless.
const glMath = {
    degreesToRadians:function(degrees){
        return degrees*(Math.PI/180)
    },
}
//#endregion
//----------MAT4 code----------
//#region 
/**
 * A 4x4 matrix for WebGL.
 * Calling the constructor will create a 4x4 identity matrix.
 */
class Mat4{
    constructor(){
        this.data = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
        this.length = 16;
    }
    /**
     * 
     * @param {Mat4} a 
     * @param {Mat4} b 
     */
    multiply(a,b){
        if(a instanceof Mat4 && b instanceof Mat4){
            var newMat4 = new Mat4();
            //There are 4 dot products when multiplying two Mat4
            for(var i=0; i<4; i++){
                //Calculate each dot product
                for(var j=0; j<4; j++){
                    newMat4.data[i*4+j] = 0;
                    for (var k=0; k<4; k++){
                        newMat4.data[i*4+j]+=a.data[i*4+k]*b.data[k*4+j]
                    }
                }
            }
            this.set(newMat4);
        }
    }
    /**
     * 
     * @param {Mat4} a 
     * @param {Mat4} b 
     */
    add(a,b){
        out = this.data;
        out[0] = a[0]+b[0]
        out[1] = a[1]+b[1]
        out[2] = a[2]+b[2]
        out[3] = a[3]+b[3]
        out[4] = a[4]+b[4]
        out[5] = a[5]+b[5]
        out[6] = a[6]+b[6]
        out[7] = a[7]+b[7]
        out[8] = a[8]+b[8]
        out[9] = a[9]+b[9]
        out[10] = a[10]+b[10]
        out[11] = a[11]+b[11]
        out[12] = a[12]+b[12]
        out[13] = a[13]+b[13]
        out[14] = a[14]+b[14]
        out[15] = a[15]+b[15]
    }
    /**
     * 
     * @param {Number|Mat4} a0 
     * @param {Number} a1 
     * @param {Number} a2 
     * @param {Number} a3 
     * @param {Number} b0 
     * @param {Number} b1 
     * @param {Number} b2 
     * @param {Number} b3 
     * @param {Number} c0 
     * @param {Number} c1 
     * @param {Number} c2 
     * @param {Number} c3 
     * @param {Number} d0 
     * @param {Number} d1 
     * @param {Number} d2 
     * @param {Number} d3 
     */
    set(a0,a1,a2,a3,b0,b1,b2,b3,c0,c1,c2,c3,d0,d1,d2,d3){
        if(!a0 instanceof Mat4){
        this.data[0] = a0
        this.data[1] = a1
        this.data[2] = a2
        this.data[3] = a3
        this.data[4] = b0
        this.data[5] = b1
        this.data[6] = b2
        this.data[7] = b3
        this.data[8] = c0
        this.data[9] = c1
        this.data[10] = c2
        this.data[11] = c3
        this.data[12] = d0
        this.data[13] = d1
        this.data[14] = d2
        this.data[15] = d3
        }else{
            for(var i=0; i<16; i++){
                this.data[i] = a0.data[i]
            }
        }
    }
    /**
     * 
     * @param {Number} fovy 
     * @param {Number} aspect 
     * @param {Number} near 
     * @param {Number} far 
     * Got me lost too many braincells.
     */
    perspective(fovy,aspect,near,far){
        var top,bottom,left,right;
        top = near*Math.tan(glMath.degreesToRadians(fovy)/2)
        bottom = -top;
        right = top*aspect;
        left = -right
        this.data[0] = 2*near/(right-left)
        this.data[1] = 0
        this.data[2] = (right+left)/(right-left)
        this.data[3] = 0
        this.data[4] = 0
        this.data[5] = 2*near/(top-bottom)
        this.data[6] = (top+bottom)/(top-bottom)
        this.data[7] = 0
        this.data[8] = 0
        this.data[9] = 0
        this.data[10] = -((far+near)/(far-near))
        this.data[11] = -1
        this.data[12] = 0
        this.data[13] = 0
        this.data[14] = -((2*far*near)/(far-near))
        this.data[15] = 0
    }
    /**
     * Too many functions
     * @param {Array} vector 
     */
    translate(vector){
        var translationMatrix = new Mat4()
        translationMatrix.data[12] = vector[0]
        translationMatrix.data[13] = vector[1]
        translationMatrix.data[14] = vector[2]
        this.multiply(this,translationMatrix);
    }
    //I might've lost 2 braincells because of this section
    /**
     * 
     * @param {Number} degrees 
     * @param {Array} origin 
     */
    rotateX(degrees,origin){
        let rads = glMath.degreesToRadians(degrees);
        let sin=Math.sin(rads),cos = Math.cos(rads);
        var rotationMatrix = new Mat4()
        rotationMatrix[12] = origin[0]
        rotationMatrix[13] = origin[1]
        rotationMatrix[14] = origin[2]
        rotationMatrix[0] = 1
        rotationMatrix[1] = 0
        rotationMatrix[2] = 0
        rotationMatrix[4] = 0
        rotationMatrix[5] = cos
        rotationMatrix[6] = sin
        rotationMatrix[8] = 0
        rotationMatrix[9] = -sin
        rotationMatrix[10] = cos
        this.multiply(this,rotationMatrix);
    }
    /**
     * 
     * @param {Number} degrees 
     * @param {Array} origin 
     */
    rotateY(degrees,origin){
        let rads = glMath.degreesToRadians(degrees);
        let sin=Math.sin(rads),cos = Math.cos(rads);
        var rotationMatrix = new Mat4()
        rotationMatrix[12] = origin[0]
        rotationMatrix[13] = origin[1]
        rotationMatrix[14] = origin[2]
        rotationMatrix[0] = cos
        rotationMatrix[1] = 0
        rotationMatrix[2] = -sin
        rotationMatrix[4] = 0
        rotationMatrix[5] = 1
        rotationMatrix[6] = 0
        rotationMatrix[8] = sin
        rotationMatrix[9] = 0
        rotationMatrix[10] = cos
        this.multiply(this,rotationMatrix);
    }
    /**
     * 
     * @param {Number} degrees 
     * @param {Array} origin 
     */
    rotateZ(degrees,origin){
        let rads = glMath.degreesToRadians(degrees);
        let sin=Math.sin(rads),cos = Math.cos(rads);
        var rotationMatrix = new Mat4()
        rotationMatrix[12] = origin[0]
        rotationMatrix[13] = origin[1]
        rotationMatrix[14] = origin[2]
        rotationMatrix[0] = cos
        rotationMatrix[1] = sin
        rotationMatrix[2] = 0
        rotationMatrix[4] = -sin
        rotationMatrix[5] = cos
        rotationMatrix[6] = 0
        rotationMatrix[8] = 0
        rotationMatrix[9] = 0
        rotationMatrix[10] = 1
        this.multiply(this,rotationMatrix);
    }
}
//#endregion