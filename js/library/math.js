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
    EPSILON:1e-4
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
        } else if(a instanceof Array ^ b instanceof Array){
            var v = a instanceof Array ? a : b;
            var m = a instanceof Array ? b : a;
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
    //But 2 braincells is not a lot
    //SHUT UP! Shhhhh...
    /**
     * 
     * @param {Number} degrees 
     * @param {Array} origin 
     */
    rotate(degrees,axis){
        let rads = glMath.degreesToRadians(degrees);
        let s=Math.sin(rads),c = Math.cos(rads),t=1-c;
        var r = new Mat4()
        let x = axis[0],y=axis[1],z=axis[2]
        let len = Math.sqrt(x*x+y*y+z*z);
        let a = this.data;
        let a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],
        b00 = x*x*t+c,
        b01 = y*x*t+z*s,
        b02 = z*x*t-y*s,
        b10 = x*y*t-z*s,
        b11 = y*y*t+x*s,
        b12 = z*y*t+y*s,
        b20 = x*z*t+y*s,
        b21 = y*z*t-x*s,
        b22 = z*z*t+c;
        if(len < glMath.EPSILON){
            this.set(r);
            return;
        }
        len = 1/len;
        x*=len;
        y*=len;
        z*=len;
        r.data[0] = a00 * b00 + a10 * b01 + a20 * b02;
        r.data[1] = a01 * b00 + a11 * b01 + a21 * b02;
        r.data[2] = a02 * b00 + a12 * b01 + a22 * b02;
        r.data[3] = a03 * b00 + a13 * b01 + a23 * b02;
        r.data[4] = a00 * b10 + a10 * b11 + a20 * b12;
        r.data[5] = a01 * b10 + a11 * b11 + a21 * b12;
        r.data[6] = a02 * b10 + a12 * b11 + a22 * b12;
        r.data[7] = a03 * b10 + a13 * b11 + a23 * b12;
        r.data[8] = a00 * b20 + a10 * b21 + a20 * b22;
        r.data[9] = a01 * b20 + a11 * b21 + a21 * b22;
        r.data[10] = a02 * b20 + a12 * b21 + a22 * b22;
        r.data[11] = a03 * b20 + a13 * b21 + a23 * b22;
        this.multiply(this,r)
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
        this.multiply(this,s);
    }
    /**
     * 
     * @param {Array} position 
     * @param {Array} target 
     * @param {Array} up 
     */
    pointTo(position,target,up){
        var forward = vec3.normalize(vec3.subtract(position,target))
        var right = vec3.normalize(vec3.cross(up,forward))
        var newup = vec3.cross(forward,right)
        var output = new Mat4()
        output.data[0] = right[0]
        output.data[1] = right[1]
        output.data[2] = right[2]
        output.data[3] = 0
        output.data[4] = newup[0]
        output.data[5] = newup[1]
        output.data[6] = newup[2]
        output.data[7] = 0;
        output.data[8] = forward[0]
        output.data[9] = forward[1]
        output.data[10] = forward[2]
        output.data[11] = 0
        output.data[12] = position[0]
        output.data[13] = position[1]
        output.data[14] = position[2]
        output.data[15] = 1;
        this.multiply(this,output)
    }
    /**
     * 
     * @param {Renderer} render 
     * @param {String} attribute 
     * @param {ShaderProgram} program 
     * @returns 
     */
    convertToUniform(render,attribute,program){
        var newUniform = new UniformMAT4Matrix(render,this.data,attribute,program.program);
        return newUniform;
    }
}
//#endregion
//----------VEC3 code----------
//#region 
const vec3 = {
    normalize:function(vector){
        thing = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])
        if(!thing){
            return [0,0,0]
        } else {
            return [vector[0]/thing,vector[1]/thing,vector[2]/thing]
        }
    },
    add:function(a,b){
        return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
    },
    subtract:function(a,b){
        return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]
    },
    cross:function(a,b){
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ]
    },
    dot:function(a,b){

    }
}
//#endregion