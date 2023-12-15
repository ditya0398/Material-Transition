import * as THREE from "three";
import { Layers, PushLayer } from "./core/LayerStack";
import CameraLayer from "./core/CameraLayer";
import MeshLayer from "./core/MeshLayer";
import UILayer from "./core/UILayer";
import MaterialsLibrary from "./core/MaterialsLibrary";


class Renderer{
    scene = null;
    camera = null;

    constructor(){
        //initialize the renderer
        this.initialize();
        this.render();
    }

    /* 
      This method initializes all the layers and adds them into the Layer Stack
    */
    intializeLayers(renderer){
       //adding the camera layer
       PushLayer(new CameraLayer);
       this.camera = Layers[Layers.length - 1].getCamera();

       //adding the mesh layer
       // PushLayer(new MeshLayer(this.scene, new THREE.IcosahedronBufferGeometry(3, 7), true));

       // PushLayer(new MeshLayer(this.scene, new THREE.SphereGeometry(5, 30), false));
       
        PushLayer(new MeshLayer(this.scene, new THREE.PlaneGeometry(2, 2), true, renderer));
       
       //adding the UI Layer
       // PushLayer(new UILayer());
    }

    /*
      Initializes the Renderer
    */
    initialize = () =>{
          this.scene = new THREE.Scene();
          this.renderer = new THREE.WebGLRenderer();
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.renderer.setSize(window.innerWidth, window.innerHeight);

          new MaterialsLibrary();

          document.body.appendChild(this.renderer.domElement);
          document.body.style.cssText = "margin: 0; overflow: hidden";
          window.addEventListener("resize", this.onWindowResize, false);
      
          this.start = Date.now();
          this.intializeLayers(this.renderer);
    }
    
    render = () => {
     
        // Render the layers which are in the Layers stack
        Layers.forEach((element) => {
          element.onUpdate();
        });

        // this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    };
    
  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

export default Renderer;