import * as THREE from "three";
import Layer from "../Layer";

class CameraLayer extends Layer{
    camera = null;
    name = null;
    constructor(_camera){
        super();
        this.camera = _camera;
        this.onAttach();
        this.setName('CameraLayer');
    }

    onAttach = () => {
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