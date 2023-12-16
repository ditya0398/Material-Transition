import * as THREE from "three";
import { ShaderMaterial } from "three";
import {fragmentShaderBlueColor, fragmentShaderCellularNoise, fragmentShaderClouds, fragmentShaderRedColor, fragmentShaderTexture, fragmentShaderfBM, vertexShaderCommon, vertexShaderFinal } from "./shaders";
// import image from './webgl.png'

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
        this.initializeMaterials();
    }

    /* 
        Creates a new Shader Material
        _wireframe: to set the wireframe mode on
        _uniform: uniforms for the shader material
        _vertexShader: Vertex Shader Source
        _fragmentShader: Fragment Shader Source
        _name: Name of the material
        type: Type of the material, Please check MaterialsType 
    */

    createCustomMaterial = (_wireframe, _uniform = null, _vertexShader = null, _fragmentShader = null, _name, imagePath = null) => {
       let texture;

        if(imagePath){
            console.log(imagePath);
           texture = new THREE.TextureLoader().load(imagePath);
            console.log(texture);
                console.log('loaded the image');
                _uniform['imageTex'].value = texture;
                console.log(_uniform);
                const _material = new ShaderMaterial({
                    wireframe: _wireframe,
                    name: _name,
                    uniforms: _uniform,
                    vertexShader: _vertexShader(),
                    fragmentShader: _fragmentShader()
                });
                MaterialsLibrary.materials.push(_material);
            
        }
        else
        {
        const _material = new ShaderMaterial({
                wireframe: _wireframe,
                name: _name,
                uniforms: _uniform,
                vertexShader: _vertexShader(),
                fragmentShader: _fragmentShader()
            });
            MaterialsLibrary.materials.push(_material);
        }
       
}
    createInbuiltMaterial = (material, _name) => {
        material.name = _name;
        MaterialsLibrary.materials.push(material);
    }

    /* 
        initialize all the shader materials
    */
    initializeMaterials = () => {
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
            
            
          
           this.createCustomMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderRedColor, 'Red Color');
           this.createCustomMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderfBM, 'fBM Noise'); 
           this.createCustomMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderBlueColor, 'Blue Color');       
           this.createCustomMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderClouds, 'Value Noise');      
           this.createCustomMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderCellularNoise, 'cellular noise'); 
           this.createCustomMaterial(false, textureUniform, vertexShaderFinal, fragmentShaderTexture, 'image', './assets/pic.jpg'); 
          
         
          
    }
}

export default MaterialsLibrary;