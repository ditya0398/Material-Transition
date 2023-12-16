import * as THREE from "three";
import { Layers, PushLayer } from "./core/LayerStack";
import CameraLayer from "./core/CameraLayer";
import MeshLayer from "./core/MeshLayer";
import UILayer from "./core/UILayer";
import MaterialsLibrary from "./core/MaterialsLibrary";
import Interpolators from "./core/Interpolator";
import SceneLayer from "./SceneLayer";


class Renderer{
    scene = null;
  

    constructor(){
        //initialize the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setViewport(0,0, window.innerWidth, window.innerHeight);

        new MaterialsLibrary();
        new Interpolators();

        document.body.appendChild(this.renderer.domElement);
        document.body.style.cssText = "margin: 0; overflow: hidden";
        window.addEventListener("resize", this.onWindowResize, false);
        this.start = Date.now();


        this.intializeLayers(this.renderer);
          
        this.render();
    }

    /* 
      This method initializes all the layers and adds them into the Layer Stack
    */
    intializeLayers(renderer){
       // pushing the scene as a layer
       PushLayer(new SceneLayer());
       this.scene = Layers[0].scene;

       //adding the camera layer
        PushLayer(new CameraLayer());
      
       //adding the mesh layer
        PushLayer(new MeshLayer(this.scene, new THREE.CircleGeometry(2,120), true, renderer));

        PushLayer(new MeshLayer(this.scene, new THREE.PlaneGeometry(4, 4), false, renderer));
       
       //adding the UI Layer
        PushLayer(new UILayer());
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