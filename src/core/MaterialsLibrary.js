import * as THREE from "three";
import { ShaderMaterial } from "three";
import { fragmentShader, fragmentShaderCellularNoise, fragmentShaderClouds, fragmentShaderDomainWarp, fragmentShaderFire, fragmentShaderLava, fragmentShaderVornoiNoise, fragmentShaderfBM, vertexShader, vertexShaderCommon, vertexShaderLava } from "./shaders";

/*
    Material Library contains all the materials
    There are two types - Custom, inbuilt

    If you need to add a new material, just create a new Material using the createMaterial() API and add the respective shader 
    if any in ./shaders/index.js and all set!
*/


class MaterialsLibrary 
{
    static materials = [];
    static MaterialType = {
        custom: 'CUSTOM',
        inbuilt: 'INBUILT'
    }
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
    createMaterial = (_wireframe, _uniform = null, _vertexShader = null, _fragmentShader = null, _name, type) => {
        if(type === MaterialsLibrary.MaterialType.custom){
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
    /* 
        initialize all the shader materials
    */
    initializeMaterials = () => {
            const uniforms =  {
              time: {
                type: "f",
                value: 0.0
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
            
        //    this.createMaterial(true, uniforms, vertexShader, fragmentShader, 'Classic Perlin', MaterialsLibrary.MaterialType.custom); 
        //    this.createMaterial(false, uniforms, vertexShaderLava, fragmentShaderLava, 'Lava Noise', MaterialsLibrary.MaterialType.custom); 
        //    this.createMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderFire, 'fire noise', MaterialsLibrary.MaterialType.custom);       
           this.createMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderfBM, 'fBM Noise', MaterialsLibrary.MaterialType.custom);       
           this.createMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderDomainWarp, 'domain warp noise', MaterialsLibrary.MaterialType.custom);  
           this.createMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderClouds, 'Value Noise',MaterialsLibrary.MaterialType.custom);      
           this.createMaterial(false, cloudUniforms, vertexShaderCommon, fragmentShaderCellularNoise, 'cellular noise', MaterialsLibrary.MaterialType.custom); 
           
    }
}

export default MaterialsLibrary;