import { Mat4 } from "./math.js";
export const CORE = {
    /**
     * Store of CATS math functions.
     */
    math:{
        /**
         * Converts degrees to radians
         * @param {Number} degrees 
         * @returns 
         */
        toRadians:function(degrees){
            return degrees*(Math.PI/180)
        },
        toDegrees:function(radians){
            return (180*radians)/Math.PI
        },
        /**
         * A small number for CATS to use
         */
        EPSILON:1e-4,
        /**
         * Prints out an inputted 4x4 matrix
         * @param {Mat4} matrix 
         */
        printAsMatrix:function(matrix){
            let m = matrix.data;
            console.log(m[0],m[4],m[8],m[12])
            console.log(m[1],m[5],m[9],m[13])
            console.log(m[2],m[6],m[10],m[14])
            console.log(m[3],m[7],m[11],m[15])
        },
        /**
         * Clamps a value between min and max
         * @param {Number} value 
         * @param {Number} min 
         * @param {Number} max 
         * @returns 
         */
        clamp:function(value,min,max){
            if(value<min)
                return min
            else if(value>max)
                return max
            return value
        },
        /**
         * Contains math functions for Vector3s
         */
        vec3:{
            /**
             * Normalizes a vector
             * @param {Array} vector 
             * @returns 
             */
            normalize:function(vector){
                let len = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])
                if(!len){
                    return [0,0,0]
                } else {
                    return [vector[0]/len,vector[1]/len, vector[2]/len]
                }
            },
            /**
             * Adds two vectors together into one
             * @param {Array} a 
             * @param {Array} b 
             * @returns 
             */
            add:function(a,b){
                return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
            },
            /**
             * Subtracts two vectors together into one
             * @param {Array} a 
             * @param {Array} b 
             * @returns 
             */
            subtract:function(a,b){
                return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]
            },
            /**
             * Gets the cross product of two vectors
             * @param {Array} a 
             * @param {Array} b 
             * @returns 
             */
            cross:function(a,b){
                return [
                    a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0]
                ]
            },
            /**
             * Gets the dot product of two vectors
             * @param {Array} a 
             * @param {Array} b 
             * @returns 
             */
            dot:function(a,b){
                return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
            },
            /**
             * Length of a vector
             * @param {Array} vector 
             * @returns 
             */
            hypot:function(vector){
                return Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])
            },
            /**
             * Multiplies a vector by a number
             * @param {Array} a 
             * @param {Number} b 
             * @returns 
             */
            multiplyByNumber:function(a,b){
                return [a[0]*b,a[1]*b,a[2]*b]
            },
            /**
             * Divides a vector by a number
             * @param {Array} a 
             * @param {Number} b 
             * @returns 
             */
            divideByNumber:function(a,b){
                return [a[0]/b,a[1]/b,a[2]/b]
            },
            /**
             * Reverses a vector
             * @param {Array} v 
             * @returns 
             */
            invert:function(v){
                return [v[0]*-1,v[1]*-1,v[2]*-1]
            },
            /**
             * Gets the length of a vector
             * @param {Array} v 
             * @returns 
             */
            lengthOf:function(v){
                return Math.sqrt(v[0]**2+v[1]**2+v[2]**2)
            }
        },
        /**
         * Holds triangle functions
         */
        triangle:{
            /**
             * Gets the surface normal of a triangle
             * @param {Array} v1 
             * @param {Array} v2 
             * @param {Array} v3 
             * @returns 
             */
            getSurfaceNormal:function(v1,v2,v3){
                let u = CORE.math.vec3.subtract(v2,v1)
                let v = CORE.math.vec3.subtract(v3,v1)
                return CORE.math.vec3.normalize(CORE.math.vec3.cross(u,v))
            },
            /**
             * Check if a ray intersects with a point
             * @param {Number} v0 The first vertex of the triangle
             * @param {Number} v1 The second vertex of the triangle
             * @param {Number} v2 The third vertex of the triangle
             * @param {Number} l0 The first point of the ray
             * @param {Number} l1 The second point of the ray
             */
            intersectsWithRay:function(v0,v1,v2,l0,l1){
                let e1 = CORE.math.vec3.subtract(v1,v0)
                let e2 = CORE.math.vec3.subtract(v2,v0)
                let n = CORE.math.vec3.cross(e1,e2);
                let dir = CORE.math.vec3.subtract(l1,l0)
                let det = -CORE.math.vec3.dot(dir,n);
                let invdet = 1/det;
                let AO = CORE.math.vec3.subtract(l0,v0);
                let DAO = CORE.math.vec3.cross(AO,dir);
                let u = CORE.math.vec3.dot(e2,DAO) * invdet;
                let v = -CORE.math.vec3.dot(e1,DAO) * invdet;
                let t = CORE.math.vec3.dot(AO,n) * invdet;
                
                return (t>=0 && u >= 0 ** v>= 0 && (u+v) <= 1 && det >= CORE.math.EPSILON)
            }
        },
        /**
         * 1/255
         */
        oneOver255:1/255,
    },
    /**
     * CATS enumerals
     */
    enum:{
        TRIANGLE_STRIP:0,
        TRIANGLES:1,
        POINT_CLOUD:2,
        LINES:3,
        ATTRIBUTE:4,
        UNIFORM:5,
        NON_ATTRIBUTE:6,
        ARRAYS:7,
        ELEMENTS:8,
        USES_COLOR_BUFFER:9,
        USES_TEXTURE_BUFFER:10,
        USES_NO_BUFFER:11,
        RGBA:12,
        FRIENDLY_RGBA:13,
        RGB:14,
        FRIENDLY_RGB:15,
        HEX:16, // WOAH SO COOL
        HSV:17,
        ARRAY_BUFFER:21,
        ELEMENT_ARRAY_BUFFER:22,
        DISABLE_DEPTH_TEST:23,
        DISABLE_CULL_FACE:24,
        DISABLE_AUTO_ADJUST_ASPECT_RATIO:25,
        DISABLE_ALPHA_BLEND:26,
        MESH:18,
        LIGHT:19,
        DIRECTIONAL_LIGHT:20,
        POINT_LIGHT:21,
        REPEAT:22,
        MIRRORED_REPEAT:23,
        CLAMP_TO_EDGE:24,
        CLAMP_TO_BORDER:25,
        USES_TEXTURE:26,
        AMBIENT_LIGHT:27,
        PHONG_LIGHTING:28,
        BASIC_LIGHTING:29,
        SPOT_LIGHT:30,
        EULER_ANGLES:31,
        QUATERNION:32,
        TEXTURE_2D:33,
        TEXTURE_CUBE_MAP_POSITIVE_X:34,
        TEXTURE_CUBE_MAP_POSITIVE_Y:35,
        TEXTURE_CUBE_MAP_POSITIVE_Z:36,
        TEXTURE_CUBE_MAP_NEGATIVE_X:37,
        TEXTURE_CUBE_MAP_NEGATIVE_Y:38,
        TEXTURE_CUBE_MAP_NEGATIVE_Z:39,
        TEXTURE_COORDINATE_BUFFER:40,
        NORMALS_BUFFER:41,
        POSITION_BUFFER:42,
        WORLD_TRANSFORM_MATRIX:43,
        WORLD_VIEW_MATRIX:44,
        CAMERA_PROJECTION_MATRIX:45,
        NORMALS_TRANSFORM_MATRIX:46,
        LIGHT_POSITION_INTENSITY_DIRECTION_MATRIX:47,
        LIGHT_COLOR_RANGE_MATRIX:48,
        
        /** 
        DIRECTIONAL_LIGHT_DIRECTIONS_UNIFORM:47,
        POINT_LIGHT_POSITIONS_AND_INTENSITIES_UNIFORM:48,
        LIGHT_COUNT_VECTOR:49,
        POINT_LIGHT_COLORS_AND_RANGE_UNIFORM:50,
        POINT_LIGHT_SPECULAR_COLORS_UNIFORM:51,
        DIRECTIONAL_LIGHT_COLORS_UNIFORM:52,
        SPOT_LIGHT_COLORS_UNIFORM:53,
        SPOT_LIGHT_POSITIONS_AND_INTENSITIES_UNIFORM:54,
        SPOT_LIGHT_SPECULAR_COLORS_UNIFROM:55,
        SPOT_LIGHT_DIRECTIONS_UNIFORM:56,
        AMBIENT_LIGHT_COLORS_AND_INTENSITIES_UNIFORM:57,*/
    },
    /**
     * Converts commonly used color formats to RGBA.
     * Formats include:
     * * HSV: "hsv(h,s,v)" 0 - 255 H 0 - 100 S & V
     * * RGB32: "rgb(r,g,b)" or [r,g,b] 0 - 255 all values
     * * RGBA32: "rgba(r,g,b,a)" or [r,g,b,a] 0 - 255 RGB 0 - 1 A
     * * HEX: "#rrggbb" 0 - FF all values
     * @param {Array|String} color 
     * @returns {Array<Number>}
     */
    Color(color){
        if(color instanceof Array){
            if(color.length == 3){
                return [
                color[0]*this.math.oneOver255,
                color[1]*this.math.oneOver255,
                color[2]*this.math.oneOver255]
            } else if (color.length == 4){
                return [
                    color[0]*this.math.oneOver255,
                    color[1]*this.math.oneOver255,
                    color[2]*this.math.oneOver255,
                    color[3]
                ]
            } else {
                throw new TypeError(`Oops! It looks like CATS does not know what kind of color you are using.\nThe length of your array is: ${color.length}`)
            }
        } else if(typeof color == "string"){
            if(color.startsWith("#")){
                let hex = color.slice(1);
                let r = parseInt(hex.slice(0,2),16)*this.math.oneOver255
                let g = parseInt(hex.slice(2,4),16)*this.math.oneOver255
                let b = parseInt(hex.slice(4,6),16)*this.math.oneOver255
                return [r,g,b,1.0]
            } else if(color.startsWith("rgb")){
                let rgba = color.slice(3);
                let hasAlpha = rgba.startsWith("a");
                let returningColor = [0,0,0,1];
                if(hasAlpha)
                    rgba = color.slice(1)
                rgba = rgba.replaceAll(/"("|")"|";"/gi)
                rgba = rgba.split(",")
                for(let i=0; i<rgba.length; i++){
                    if(i!=3){
                        let currentDigit = parseInt(rgba[i]);
                        returningColor[i] = currentDigit*this.math.oneOver255;
                    } else {
                        returningColor[i] = parseFloat(rgba[i])
                    }
                }
                return returningColor;
            } else if(color.startsWith("hsv")){
                let hsv = color.slice(3);
                hsv = hsv.replaceAll(/"("|")"|";"/gi)
                hsv = hsv.split(",")
                for(let i=0; i<3; i++){
                    hsv[i] = parseFloat(hsv[i])
                }
                if(hsv[0] > 360 || hsv[0] < 0 || hsv[1] > 100 || hsv[1] < 0 || hsv[2] > 100 || hsv[2] < 0){
                    throw new TypeError(`Oops! It looks like this color's values seems to be out of range.`)
                }
                hsv[0] = hsv[0]/360
                let h = hsv[0],s = hsv[1],v = hsv[2]
                let i = Math.floor(hsv[0]*6)
                let f = h * 6 - i
                let p = v * (1-s)
                let q = v * (1-f*s)
                let t = v * (1-(1-f)*s)
                let r,g,b;
                switch(i%6){
                    case 0: r=v, g=t, b=p;break;
                    case 1: r=q, g=v, b=p;break;
                    case 2: r=p, g=v, b=t;break;
                    case 3: r=p, g=q, b=v;break;
                    case 4: r=t, g=p, b=v;break;
                    case 5: r=v, g=p, b=q;break;
                }
                return [r,g,b,1.0]
            }   
        } else {
            throw new TypeError(`Oops! It looks like CATS cannot parse this data type.\nData type: ${color.constructor}`)
        }
    },
    shaderReference:{
        PHONG_LIGHTING:`int ndLights = int(lightCounts.x);
        int npLights = int(lightCounts.y);
        int naLights = int(lightCounts.w);
        int nsLights = int(lightCounts.z);
        if(ndLights>MAXDLIGHTSOURCES){
            ndLights = MAXDLIGHTSOURCES;
        }
        if(naLights>MAXDLIGHTSOURCES){
            naLights = MAXDLIGHTSOURCES;
        }
        if(npLights>MAXPLIGHTSOURCES){
            npLights = MAXPLIGHTSOURCES;
        }
        if(nsLights>MAXPLIGHTSOURCES){
            nsLights = MAXPLIGHTSOURCES;
        }
        vec3 normal = normalize(fN);
        float light = 0.0;
        float specular = 0.0;
        vec3 lightColor,specularColor;
        //Directional
        for(int i=0; i<MAXDLIGHTSOURCES; i++){
            if(i>=ndLights){
                break;
            }
            float increment = dot(normal,lightDirection[i].xyz*lightDirection[i].w);
            if(increment<0.0){
                increment = 0.0;
            }
            lightColor+=directionalLightColors[i];
            light+=increment;
        }
        //Point
        for(int i=0; i<MAXPLIGHTSOURCES; i++){
            if(i>=npLights){
                break;
            }
            vec3 surfaceToLight = normalize(lightPosition[i].xyz - fP);
            vec3 surfaceToView = normalize(surfaceToView);
            vec3 halfVector = normalize(surfaceToLight+surfaceToView);
            float distance = pow(
                surfaceToLight.x*surfaceToLight.x+
                surfaceToLight.y*surfaceToLight.y+
                surfaceToLight.z*surfaceToLight.z,0.5
            );
            float subtraction;
            if(distance<=pointLightColors[i].w){
                subtraction = 0.0;
            } else {
                float range = pointLightColors[i].w;
                subtraction = distance*(0.3/range);
            }
            float increment = (dot(fN,surfaceToLight)-subtraction)*lightPosition[i].w;
            if(increment<0.0){
                increment = 0.0;
            }
            lightColor += pointLightColors[i].rgb;
            light+=increment;
            if(shininess <= 0.0){
                continue;
            }
            float specularIncrement = 0.0;
            if(increment>0.0){
                specularIncrement = pow(dot(fN,halfVector),shininess);
            }
            if(specularIncrement<0.0){
                specularIncrement = 0.0;
            }
            specularColor += pointLightSpecularColors[i].rgb;
            specular+=specularIncrement;
        }
        
        //Ambient
        for(int i=0; i<MAXDLIGHTSOURCES; i++){
            if(i>=naLights){
                break;
            }
            lightColor += ambientLights[i].rgb;
            light+=ambientLights[i].w;
        }
        //light+=float(naLights);
        if(light > 1.0){
            light = 1.0;
        }else if(light < 0.0){
            light = 0.0;
        }`,
        BASIC_LIGHTING:
        `
        float light = 2.0;
        float specular = 0.0;
        vec3 lightColor = vec3(1.0,1.0,1.0);
        vec3 specularColor = vec3(1.0,1.0,1.0);
        `,
        FRAG_ATTR:`
        precision mediump float;

        varying mediump vec3 fN;
        varying mediump vec3 fP;
        varying mediump vec3 surfaceToView;

        uniform vec4 lightDirection[MAXDLIGHTSOURCES];
        uniform vec4 lightPosition[MAXPLIGHTSOURCES];
        uniform vec4 lightCounts;
        uniform vec4 pointLightColors[MAXPLIGHTSOURCES];
        uniform vec3 pointLightSpecularColors[MAXPLIGHTSOURCES];
        uniform vec3 directionalLightColors[MAXDLIGHTSOURCES];
        uniform vec4 spotLightColors[MAXPLIGHTSOURCES];
        uniform vec4 spotLightPosition[MAXPLIGHTSOURCES];
        uniform vec3 spotLightSpecularColors[MAXPLIGHTSOURCES];
        uniform vec4 spotLightDirection[MAXPLIGHTSOURCES];
        uniform vec4 ambientLights[MAXDLIGHTSOURCES];
        
        uniform float shininess;
        `,
        setLightingShader:function(type){
            switch(type){
                case CORE.enum.PHONG_LIGHTING:
                    return CORE.shaderReference.PHONG_LIGHTING;
                case CORE.enum.BASIC_LIGHTING:
                    return CORE.shaderReference.BASIC_LIGHTING
                default:
                    return CORE.shaderReference.BASIC_LIGHTING
            }
        },
        defaultAttributes:{

        }
    },
    material:{
        BufferEnumLookup:{}
    },
    /**
     * Load a mesh
     * @deprecated This function has limited use, and is only to be used while developing Milestone 3
     * @param {String} URL The URL of the mesh
     * @param {Array<String|Number>} vertexAttribute A path to the vertex attribute
     * @param {Array<String|Number>} indexAttribute A path to the index attribute
     * @param {Array<String|Number>} normalsAttribute A path to the normals attribute
     * @param {Array<String|Number>} textureCoordinateAttribute A path to the texture coordinate attribute
     * @param {Array<String|Number>} tree A path that is used by all paths, i.e. ["rootnode"] -> ["vertexAttrib"] is the same as ["rootnode","vertexAttrib"]
     * @param {String} texture
     */
    /** 
    async loadMesh(URL,vertexAttribute,indexAttribute,normalsAttribute,textureCoordinateAttribute,tree){
        const response = await fetch(URL).then(data=>data.json());
        var thejson = response;
        
        for(var i=0; i<tree.length; i++){
            thejson = thejson[tree[i]]
        }
        
        var stuff = {
            "va":thejson,
            "ia":thejson,
            "na":thejson,
            "tc":thejson
        }
        for(var attrib in stuff){
            var target = ""
            switch(attrib){
                case "va":
                    target = vertexAttribute
                    break;
                case "ia":
                    target = indexAttribute
                    break;
                case "na":
                    target = normalsAttribute
                    break;
                case "tc":
                    target = textureCoordinateAttribute
                    break;
            }
            
            if(typeof target == "string"){
                target = [target]
            }
            for(var i=0; i<target.length; i++){
                stuff[attrib] = stuff[attrib][target[i]]
            }
        }
        //console.log(stuff)
        var mymesh = new Mesh(stuff.va,stuff.ia,null,normalsAttribute?1:0,normalsAttribute?stuff.na:null,textureCoordinateAttribute?stuff.tc:null)
        return mymesh;
    }*/
}
Object.freeze(CORE)