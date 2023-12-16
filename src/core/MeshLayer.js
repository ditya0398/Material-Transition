import * as THREE from "three";
import { IcosahedronGeometry, Mesh, PlaneGeometry } from "three";
import Layer from "./Layer";
import MaterialsLibrary from "./MaterialsLibrary";
import { Layers } from "./LayerStack";
import { fragmentShaderNoiseInterpolation, fragmentShaderHermitieInterpolation, fragmentShaderLinearInterpolation, vertexShaderCommon, vertexShaderFinal } from "./shaders";
import Interpolators from "./utils/Interpolators";

class MeshLayer extends Layer{
    mesh = null;
    start = null;
    materialsLibrary = null;
    meshGeometry = null;
    name = null;
    toBeRendered = true;
    renderTargetFirstMaterial = null;
    renderTargetSecondMaterial = null;
    sceneFirstMaterial = null;
    sceneSecondMaterial = null;
    cameraFirstScene = null;
    cameraSecondScene = null;
    finalScene = null;
    renderer = null;
    timeDelta = 0.0;
    firstMesh =  null;
    secondMesh =  null;


    constructor(_scene, _meshGeom, _isVisible, _renderer, _interPolationDelta){
        super();
        this.setVisibility(_isVisible);
        this.meshGeometry = _meshGeom;
        this.finalScene = _scene;
        this.renderer = _renderer;
        this.onAttach();
        this.setName('MeshLayer');

    }

    onAttach = () => {
        this.initializeRenderTargets();
        this.initFinalSceneMesh();
        this.start = Date.now();
    }

    initializeRenderTargets(){
      const geometry = this.meshGeometry;
      this.firstMesh = new Mesh(geometry, MaterialsLibrary.materials[1]);

      //Setup things for first scene
      this.sceneFirstMaterial = new THREE.Scene();
      let cameraLayer;
      Layers.forEach((layer) => {

        if(layer.name === 'CameraLayer')
        {
          cameraLayer = layer;
        }
      })
      this.cameraFirstScene = cameraLayer.getCamera();
      this.renderTargetFirstMaterial = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
      this.sceneFirstMaterial.add(this.firstMesh);


      //setup scene for the second scene
      this.sceneSecondMaterial = new THREE.Scene();
      this.cameraSecondScene = cameraLayer.getCamera();
      this.renderTargetSecondMaterial = new THREE.WebGLRenderTarget(window.innerWidth,window.innerHeight);
      this.secondMesh = new Mesh(geometry, MaterialsLibrary.materials[0]);
      this.sceneSecondMaterial.add(this.secondMesh);
    }

    initFinalSceneMesh = () => {
      const secondMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tPrevious: {type: 't', value: null},
          tPrevious1: {type: 't', value: null},
          time: {type: 'f', value: 0.0}
        },
        vertexShader: vertexShaderFinal(),
        fragmentShader: fragmentShaderLinearInterpolation(),
      });
      const geometry = this.meshGeometry;
      const _mesh = new Mesh(geometry, secondMaterial);
      this.finalScene.add(_mesh);
      this.setMesh(_mesh);
    
    }

    renderToRenderTarget = (renderTarget, camera, scene) => {
      this.renderer.setRenderTarget(renderTarget);
      this.renderer.render(scene, camera);
      this.renderer.setRenderTarget(null);
    }

    renderMaterials = () => {
      if(MaterialsLibrary.materials.length > 1){
      this.renderToRenderTarget(this.renderTargetFirstMaterial, this.cameraFirstScene, this.sceneFirstMaterial);
      this.renderToRenderTarget(this.renderTargetSecondMaterial, this.cameraSecondScene, this.sceneSecondMaterial);

      if(this.mesh){
        this.mesh.material.uniforms['time'].value = this.timeDelta;
        this.mesh.material.uniforms['tPrevious'].value = this.renderTargetFirstMaterial.texture;
        this.mesh.material.uniforms['tPrevious1'].value = this.renderTargetSecondMaterial.texture;
       
        if(this.timeDelta < Interpolators.activeInterPolater.threshold){
          this.timeDelta += 0.007
        }
      }
      
      }
      if(MaterialsLibrary.materials.length === 1)
      {
        this.renderToRenderTarget(this.renderTargetFirstMaterial, this.cameraFirstScene, this.sceneFirstMaterial);
        this.renderToRenderTarget(this.renderTargetSecondMaterial, this.cameraSecondScene, this.sceneSecondMaterial);

        this.mesh.material.uniforms['time'].value = this.timeDelta;
        this.mesh.material.uniforms['tPrevious'].value = this.renderTargetFirstMaterial.texture;
        this.mesh.material.uniforms['tPrevious1'].value = this.renderTargetSecondMaterial.texture;

        if(this.timeDelta < Interpolators.activeInterPolater.threshold){
          this.timeDelta += 0.007
        }
       
      }
      

      this.renderer.render(this.finalScene, this.cameraFirstScene);
    }

    onUpdate = () => {
      if(this.mesh){
        this.mesh.visible = this.toBeRendered;
        if(this.mesh.visible === true){
          this.renderMaterials();
        }
      }
    }

    setMesh = (_mesh) => {
      this.mesh = _mesh;
    }

    setFirstMeshMaterial = (_material) => {
      this.firstMesh.material = _material;
    }

    setSecondMeshMaterial = (_material) => {
      this.secondMesh.material = _material;
    }

    resetTimeDelta = () => {
      this.timeDelta = 0.0;
    }

    setMaterial = (_material) => {
      if(this.mesh){
        this.mesh.material  = _material;
      }
    }
    // Sets the visibility of the mesh 
    setVisibility = (_isVisible) => {
      this.toBeRendered = _isVisible;
      console.log(this.toBeRendered);
    }

    getVisibility = () => {
      return this.toBeRendered;
    }
    // returs the specific mesh from the respective mesh layer
    getMesh = () => {
        return this.mesh;
    }    
    
    //sets the name of the layer
    setName = (_name) => {
      this.name = _name;
    }


}


export default MeshLayer;