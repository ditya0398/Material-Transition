import * as THREE from "three";
import { Mesh } from "three";

class MeshProps{
    scene = null;
    mesh = null;
    constructor(_material, _geometry){
        this.scene  = new THREE.Scene();
        this.mesh =  new Mesh(_geometry, _material);
        this.scene.add(this.mesh);
        }
}

export default MeshProps;