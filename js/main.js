/**
 * C.A.T.S.
 * Che's Awesome Three-dimensional toolS
 * 
 * Created by Che Yu.
 * 
 * If you didn't download the whole repository then here you go:
 * Copyright © 2023 Che Yu
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
import * as buffers from "./buffers.js"
import * as light from "./light.js"
import * as material from "./material.js"
import * as math from "./math.js"
import * as mesh from "./mesh.js"
import * as packages from "./package.js"
import * as primitives from "./primitives.js"
import * as renderer from "./renderer.js"
import * as scene from "./scene.js"
import * as shaders from "./shaders.js"
import * as core from "./core.js"
let importlist = [buffers,light,material,math,mesh,packages,primitives,renderer,scene,shaders,core]
let exported = {}
for(let i=0; i<importlist.length; i++){
    for(const key in importlist[i]){
        exported[key] = importlist[i][key];
    }
}
Object.freeze(exported)
export default exported