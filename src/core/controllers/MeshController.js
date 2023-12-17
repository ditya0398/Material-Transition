
import * as THREE from "three";
import { Mesh } from "three";
import MaterialsLibrary from "../utils/MaterialsLibrary";
import RenderTarget from "../models/RenderTarget";
import { vertexShaderFinal, fragmentShaderLinearInterpolation } from "../shaders";
import Interpolators from "../utils/Interpolators";
import MeshProps from "../models/MeshProps";

class MeshController
{
    RenderTargetComponents = [];
    renderTarget;
    mesh = null;
    _environment = null;
    timeDelta  = 0.0;
    renderer = null;
    interpolationDelta = 0.0;
    meshGeometry = null;

    constructor(_geometry, _environment, _renderer, _interpolationDelta){
        this.meshGeometry = _geometry;
        this.renderer = _renderer;
        this.environment = _environment;
        this.interpolationDelta = _interpolationDelta;

        this.renderTarget = new RenderTarget(2);
        this.initializeRTMeshes(2, _geometry);
        this.initFinalSceneMesh(_geometry, _environment);
    }

    initializeRTMeshes(numberOfCount, _geometry){
        for(let i = numberOfCount - 1; i >= 0; i--){
           this.RenderTargetComponents.push(new MeshProps(MaterialsLibrary.materials[i], _geometry));
        }

    }

    initFinalSceneMesh = (_geometry) => {
        const secondMaterial = new THREE.ShaderMaterial({
          uniforms: {
            tPrevious: {type: 't', value: null},
            tPrevious1: {type: 't', value: null},
            time: {type: 'f', value: 0.0}
          },
          vertexShader: vertexShaderFinal(),
          fragmentShader: fragmentShaderLinearInterpolation(),
        });
        
        const _mesh = new Mesh(_geometry, secondMaterial);
        this.environment.scene.add(_mesh);
        this.mesh = _mesh;
      }
    

    resetTimeDelta = () => {
        this.timeDelta = 0.0;
      }
      
    renderMesh = (_visibilty) => {
        if(this.mesh){
            this.mesh.visible = _visibilty;
            if(this.mesh.visible === true){
              this.renderMaterials();
            }
          }
      }

    renderToRenderTarget = (renderTarget, camera, scene) => {
       
        this.renderer.setRenderTarget(renderTarget);
        this.renderer.render(scene, camera);
        this.renderer.setRenderTarget(null);
      }
  
    renderMaterials = () => {
        if(MaterialsLibrary.materials.length > 0){
          this.renderToRenderTarget(this.renderTarget.renderTargets[0] ,this.environment.camera,  this.RenderTargetComponents[0].scene);
          this.renderToRenderTarget(this.renderTarget.renderTargets[1] ,this.environment.camera, this.RenderTargetComponents[1].scene);

          if(this.mesh){
            this.mesh.material.uniforms['time'].value = this.timeDelta;
            this.mesh.material.uniforms['tPrevious'].value = this.renderTarget.renderTargets[0].texture;
            this.mesh.material.uniforms['tPrevious1'].value = this.renderTarget.renderTargets[1].texture;
          
            if(this.timeDelta < Interpolators.activeInterPolater.threshold){
              this.timeDelta += 0.007
            }
        }
        
        }
        this.renderer.render(this.environment.scene, this.environment.camera);
      }

       // returs the specific mesh from the respective mesh layer
    getMesh = () => {
        return this.mesh;
    }    
    setMaterial = (_material) => {
        if(this.mesh){
          this.mesh.material  = _material;
        }
      }
}

export default MeshController;