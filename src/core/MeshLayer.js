import * as THREE from "three";
import { IcosahedronGeometry, Mesh, PlaneGeometry } from "three";
import Layer from "./Layer";
import MaterialsLibrary from "./MaterialsLibrary";
import { Layers } from "./LayerStack";

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
    constructor(_scene, _meshGeom, _isVisible, _renderer){
        super();
        this.toBeRendered = _isVisible;
        this.meshGeometry = _meshGeom;
        this.finalScene = _scene;
        this.renderer = _renderer;
        this.onAttach();
        this.setName('MeshLayer');

    }

    onAttach = () => {
        this.createMaterialSpecificThings();
        this.initFinalSceneMesh();
        this.start = Date.now();
    }

  
    createMaterialSpecificThings(){

      const geometry = this.meshGeometry;
      this.firstMesh = new Mesh(geometry, MaterialsLibrary.materials[0]);

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
      this.renderTargetFirstMaterial = new THREE.WebGLRenderTarget(1024,1024);
      this.sceneFirstMaterial.add(this.firstMesh);


      //setup scene for the second scene
      this.sceneSecondMaterial = new THREE.Scene();
      this.cameraSecondScene = cameraLayer.getCamera();
      this.renderTargetSecondMaterial = new THREE.WebGLRenderTarget(1024,1024);
      this.secondMesh = new Mesh(geometry, MaterialsLibrary.materials[4]);
      this.sceneSecondMaterial.add(this.secondMesh);


      this.renderer.setRenderTarget(this.renderTargetFirstMaterial);
  
      this.renderer.render(this.sceneFirstMaterial, this.cameraFirstScene);
      
      this.renderer.setRenderTarget(null);
    
    
      
      this.renderer.setRenderTarget(this.renderTargetSecondMaterial);
      
      this.renderer.render(this.sceneSecondMaterial, this.cameraSecondScene);
      
      this.renderer.setRenderTarget(null);


    }

    initFinalSceneMesh = () => {
      const secondMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tPrevious: {type: 't', value: this.renderTargetFirstMaterial.texture},
          tPrevious1: {type: 't', value: this.renderTargetSecondMaterial.texture},
          time: {type: 'f', value: 0.0}
        },
        vertexShader: `
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tPrevious;
          uniform sampler2D tPrevious1;
          varying vec2 vUv;
          uniform float time;

          vec3 hermiteInterpolation(vec3 color1, vec3 color2, float t) {
            float t2 = t * t;
            float t3 = t2 * t;
        
            // Hermite interpolation formula
            float h1 = 2.0 * t3 - 3.0 * t2 + 1.0;
            float h2 = -2.0 * t3 + 3.0 * t2;
            float h3 = t3 - 2.0 * t2 + t;
            float h4 = t3 - t2;
        
            // Interpolate each component separately
            vec3 result = color1 * h1 + color2 * h2 + (color1 - color2) * h3 + (color2 - color1) * h4;
        
            return result;
        }
          void main() {
            vec4 color = texture2D(tPrevious, vUv);
            vec4 color2 = texture2D(tPrevious1, vUv);
            // vec3 newCol = mix(color, color2, time).rgb;
            vec3 newCol = hermiteInterpolation(color.rgb, color2.rgb, time);

            gl_FragColor = vec4(newCol,1.0);
          }
        `,
      });
      const geometry = this.meshGeometry;
      const _mesh = new Mesh(geometry, secondMaterial);
      this.finalScene.add(_mesh);
      this.setMesh(_mesh);
      console.log(this.finalScene);
    
    }

  
    renderMaterials = () => {
      this.renderer.setRenderTarget(this.renderTargetFirstMaterial);
  
      this.renderer.render(this.sceneFirstMaterial, this.cameraFirstScene);
      
      this.renderer.setRenderTarget(null);
    
    
      this.renderer.setRenderTarget(this.renderTargetSecondMaterial);
      
      this.renderer.render(this.sceneSecondMaterial, this.cameraSecondScene);
      
      this.renderer.setRenderTarget(null);

      if(this.mesh){
        this.mesh.material.uniforms['time'].value = this.timeDelta;
        if(this.timeDelta < 1.0){
        this.timeDelta += 0.007
        // console.log(this.timeDelta);
        }
        // else
        // {
        //   this.timeDelta = 0.0;
        // }
      }
      

      this.renderer.render(this.finalScene, this.cameraFirstScene);



    }

    onUpdate = () => {
    //  if(this.mesh){
    //     this.updateMeshMaterial();
    //     this.mesh.visible = this.toBeRendered;
    //  }

    this.renderMaterials();
    }

    setMesh = (_mesh) => {
      this.mesh = _mesh;
    }

    // Sets the visibility of the mesh 
    setVisibility = (_isVisible) => {
      this.toBeRendered = _isVisible;
      console.log(this.toBeRendered);
    }

   
    // returs the specific mesh from the respective mesh layer
    getMesh = () => {
        return this.mesh;
    }    

    //sets the name of the layer
    setName = (_name) => {
      this.name = _name;
    }

    // updates the material of the mesh
    updateMeshMaterial = () => {
      
      MaterialsLibrary.materials.forEach((material) => {
          if(material.name  === this.mesh.material.name){
                  material.uniforms["time"].value =
                  0.0001 * (Date.now() - this.start);   
          }
      });
     
    };

}

export default MeshLayer;