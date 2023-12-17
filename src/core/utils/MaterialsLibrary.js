import * as THREE from "three";

import {fragmentShaderBlueColor, fragmentShaderCellularNoise, fragmentShaderClouds, fragmentShaderRedColor, fragmentShaderTexture, fragmentShaderfBM, vertexShaderCommon, vertexShaderFinal } from "../shaders";
import Material from "../models/Material";

/*
    Material Library contains all the materials
    There are two types - Custom, inbuilt

    If you need to add a new material, just create a new Material using the createMaterial() API and add the respective shader 
    if any in ./shaders/index.js and all set!
*/

class MaterialsLibrary 
{
    static materials = [];
    
    constructor(){
        const textureUniform =  {
            imageTex: {
            type: "t",
            value: null
          }
        }

        const cloudUniforms = {
            u_resolution: {
              value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            time: {
                type: "f",
                value: 0.0
              }

        }
        
       new Material(false, cloudUniforms, vertexShaderCommon, fragmentShaderRedColor, 'Red Color');
       new Material(false, cloudUniforms, vertexShaderCommon, fragmentShaderfBM, 'fBM Noise'); 
       new Material(false, cloudUniforms, vertexShaderCommon, fragmentShaderBlueColor, 'Blue Color');       
       new Material(false, cloudUniforms, vertexShaderCommon, fragmentShaderClouds, 'Value Noise');      
       new Material(false, cloudUniforms, vertexShaderCommon, fragmentShaderCellularNoise, 'cellular noise'); 
       new Material(false, textureUniform, vertexShaderCommon, fragmentShaderTexture, 'image', './assets/pic.jpg');
    } 
}
export default MaterialsLibrary;