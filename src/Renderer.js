import * as THREE from "three";
import { Layers, PushLayer } from "./core/LayerStack";
import CameraLayer from "./core/CameraLayer";
import MeshLayerUI from "./core/MeshLayer";
import UILayer from "./core/UILayer";
import MaterialsLibrary from "./core/MaterialsLibrary";
import Interpolators from "./core/utils/Interpolators";
import SceneLayer from "./SceneLayer";
import Environment from "./Environment";
import onWindowResize from "./Utils";


class Renderer{
    scene = null;
    environment = null;

    constructor(){
        this.environment = new Environment();
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setViewport(0,0, window.innerWidth, window.innerHeight);


        document.body.appendChild(renderer.domElement);
        document.body.style.cssText = "margin: 0; overflow: hidden";
        window.addEventListener('resize', onWindowResize(this.environment.camera, renderer), false);
       
        this.intializeLayers(renderer);
        this.render();
    }

    /* 
      This method initializes all the layers and adds them into the Layer Stack
    */
    intializeLayers(renderer){
        // pushing the scene as a layer
        PushLayer(new SceneLayer(this.environment));

        //adding the camera layer
        PushLayer(new CameraLayer());
      
        //adding the mesh layer
        PushLayer(new MeshLayerUI(this.environment, new THREE.CircleGeometry(2,120), true, renderer));

        PushLayer(new MeshLayerUI(this.environment, new THREE.PlaneGeometry(4, 4), false, renderer));
       
        //adding the UI Layer
        PushLayer(new UILayer());
    }

   
    
    render = () => {
     
        // Render the layers which are in the Layers stack
        Layers.forEach((element) => {
          element.onUpdate();
        });

        requestAnimationFrame(this.render);
    };

}

export default Renderer;