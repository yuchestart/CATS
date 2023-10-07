import { CATS } from "./core.js"
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
    multiply(b){
        var a = this;
        if(b instanceof Mat4){
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
        } else if( b instanceof Array){
            var v = b;
            var m = a.data;
            return [
                v[0]*m[0]+v[1]*m[4]+v[2]*m[8]+v[3]*m[12],
                v[0]*m[1]+v[1]*m[5]+v[2]*m[9]+v[3]*m[13],
                v[0]*m[2]+v[1]*m[6]+v[2]*m[10]+v[3]*m[14],
                v[0]*m[3]+v[1]*m[7]+v[2]*m[11]+v[3]*m[15],
            ];
        }
    }
    /**
     * 
     * @param {Mat4} a 
     * @param {Mat4} b 
     */
    add(a,b){
        this.data[0] = a[0]+b[0]
        this.data[1] = a[1]+b[1]
        this.data[2] = a[2]+b[2]
        this.data[3] = a[3]+b[3]
        this.data[4] = a[4]+b[4]
        this.data[5] = a[5]+b[5]
        this.data[6] = a[6]+b[6]
        this.data[7] = a[7]+b[7]
        this.data[8] = a[8]+b[8]
        this.data[9] = a[9]+b[9]
        this.data[10] = a[10]+b[10]
        this.data[11] = a[11]+b[11]
        this.data[12] = a[12]+b[12]
        this.data[13] = a[13]+b[13]
        this.data[14] = a[14]+b[14]
        this.data[15] = a[15]+b[15]
    }
    identity(){
        this.data[0] = 1
        this.data[1] = 0
        this.data[2] = 0
        this.data[3] = 0
        this.data[4] = 0
        this.data[5] = 1
        this.data[6] = 0
        this.data[7] = 0
        this.data[8] = 0
        this.data[9] = 0
        this.data[10] = 1
        this.data[11] = 0
        this.data[12] = 0
        this.data[13] = 0
        this.data[14] = 0
        this.data[15] = 1
    }
    subtract(a,b){
        this.data[0] = a[0]-b[0]
        this.data[1] = a[1]-b[1]
        this.data[2] = a[2]-b[2]
        this.data[3] = a[3]-b[3]
        this.data[4] = a[4]-b[4]
        this.data[5] = a[5]-b[5]
        this.data[6] = a[6]-b[6]
        this.data[7] = a[7]-b[7]
        this.data[8] = a[8]-b[8]
        this.data[9] = a[9]-b[9]
        this.data[10] = a[10]-b[10]
        this.data[11] = a[11]-b[11]
        this.data[12] = a[12]-b[12]
        this.data[13] = a[13]-b[13]
        this.data[14] = a[14]-b[14]
        this.data[15] = a[15]-b[15]
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
        top = near*Math.tan(CATS.math.toRadians(fovy)/2)
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
        this.multiply(translationMatrix);
    }
    /**
     * Enter a vector with 3 DEGREE values not radians
     * @param {Number} degrees 
     * @param {Array} origin 
     */
    rotate(vector){
        //Please don't run slowly, even though I did 6 sin and cos.
        var [x,y,z] = vector;
        x=CATS.math.toRadians(x)
        y=CATS.math.toRadians(y)
        z=CATS.math.toRadians(z)
        var zrm = new Mat4();
        var cos,sin;
        cos=Math.cos(z);
        sin=Math.sin(z);
        zrm.data[0] = cos;
        zrm.data[1] = -sin;
        zrm.data[4] = sin;
        zrm.data[5] = cos;
        var yrm = new Mat4();
        cos=Math.cos(y);
        sin=Math.sin(y);
        yrm.data[0] = cos;
        yrm.data[2] = sin;
        yrm.data[8] = -sin;
        yrm.data[10] = cos;
        var xrm = new Mat4();
        cos=Math.cos(x);
        sin=Math.sin(x);
        xrm.data[5] = cos;
        xrm.data[6] = -sin;
        xrm.data[9] = sin;
        xrm.data[10] = cos;
        var out = new Mat4();
        zrm.multiply(yrm);
        out.multiply(zrm);
        out.multiply(xrm);
        this.multiply(out);
    }
    /**
     * 
     * @param {Array} vector 
     */
    scale(vector){
        var s = new Mat4()
        s.data[0] = vector[0];
        s.data[5] = vector[1];
        s.data[10] = vector[2];
        this.multiply(s);
    }
    /**
     * 
     * @param {Array} position 
     * @param {Array} target 
     * @param {Array} up 
     */
    lookAt(position,target,up){
        let x,y,z,out,len
        z = CATS.math.vec3.subtract(position,target)
        if(
            Math.abs(position[0]-target[0])<CATS.math.EPSILON &&
            Math.abs(position[1]-target[1])<CATS.math.EPSILON &&
            Math.abs(position[2]-target[2])<CATS.math.EPSILON
        ){
            this.identity()
        }
        len = 1/Math.hypot(z[0],z[1],z[2])
        z = CATS.math.vec3.multiplyByNumber(z,len)
        x = CATS.math.vec3.cross(up,z)
        y = CATS.math.vec3.cross(z,x)
        out = new Mat4()
        out.data[0] = x[0]
        out.data[1] = y[0]
        out.data[2] = z[0]
        out.data[3] = 0
        out.data[4] = x[1]
        out.data[5] = y[1]
        out.data[6] = z[1]
        out.data[7] = 0
        out.data[8] = x[2]
        out.data[9] = y[2]
        out.data[10] = z[2]
        out.data[11] = 0;
        out.data[12] = -CATS.math.vec3.dot(x,position)
        out.data[13] = -CATS.math.vec3.dot(y,position)
        out.data[14] = -CATS.math.vec3.dot(z,position)
        out.data[15] = 1
        this.multiply(out)
    }
    invert(){
        let a00 = this.data[0],
          a01 = this.data[1],
          a02 = this.data[2],
          a03 = this.data[3];
        let a10 = this.data[4],
          a11 = this.data[5],
          a12 = this.data[6],
          a13 = this.data[7];
        let a20 = this.data[8],
          a21 = this.data[9],
          a22 = this.data[10],
          a23 = this.data[11];
        let a30 = this.data[12],
          a31 = this.data[13],
          a32 = this.data[14],
          a33 = this.data[15];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;
        let det =
          b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
          this.identity()
        }
        det = 1.0 / det;
        this.data[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.data[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.data[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.data[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.data[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.data[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.data[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.data[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.data[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.data[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.data[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.data[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.data[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.data[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.data[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.data[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    }
    transpose(){
        this.data[0] = this.data[0]
        this.data[1] = this.data[4]
        this.data[2] = this.data[8]
        this.data[3] = this.data[12]
        this.data[4] = this.data[1]
        this.data[5] = this.data[5]
        this.data[6] = this.data[9]
        this.data[7] = this.data[13]
        this.data[8] = this.data[2]
        this.data[9] = this.data[6]
        this.data[10] = this.data[10]
        this.data[11] = this.data[14]
        this.data[12] = this.data[3]
        this.data[13] = this.data[7]
        this.data[14] = this.data[11]
        this.data[15] = this.data[15]
    }
}
export {Mat4}