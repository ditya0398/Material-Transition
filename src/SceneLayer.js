import * as THREE from "three";
import Layer from "./core/Layer";

class SceneLayer extends Layer
{   
    scene = null;
    name = null;

    constructor(){
        super();
        this.scene = new THREE.Scene();
        this.setName('Scenelayer');
    }

    getScenet(){
        return this.scene;
    }
    onAttach = () => {

    }

    onDetach = () => {

    }

    onUpdate = () => {

    }

    setName = (_name) => {
        this.name = _name;
    }

}

export default SceneLayer;