import * as THREE from "three";
import MaterialsLibrary from "./core/MaterialsLibrary";

class Environment{

    scene = null;
    camera = null;
    constructor(){
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 10;

        new MaterialsLibrary();
    }
}

export default Environment;