import * as THREE from "three";
import { ShaderMaterial } from "three";
import MaterialsLibrary from "../utils/MaterialsLibrary";
class Material {
    constructor(_wireframe, _uniform = null, _vertexShader = null, _fragmentShader = null, _name, imagePath = null){
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
}

export default Material;