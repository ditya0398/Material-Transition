import * as THREE from "three";
import Layer from "./Layer";

class CameraLayer extends Layer{
    camera = null;
    name = null;
    constructor(){
        super();
        this.onAttach();
        this.setName('CameraLayer');
    }

    onAttach = () => {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          this.camera.position.z = 10;
    };

    onDetach = () => {
    };

    onUpdate = () => {
    }
    
    getCamera(){
        return this.camera;
    }

    setName = (_name) => {
        this.name = _name;
      }
}

export default CameraLayer;