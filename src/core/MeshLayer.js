import { IcosahedronGeometry, Mesh, PlaneGeometry } from "three";
import Layer from "./Layer";
import MaterialsLibrary from "./MaterialsLibrary";

class MeshLayer extends Layer{
    mesh = null;
    start = null;
    materialsLibrary = null;
    meshGeometry = null;
    name = null;
    toBeRendered = true;
    
    constructor(_scene, _meshGeom, _isVisible){
        super();
        this.toBeRendered = _isVisible;
        this.meshGeometry = _meshGeom;
        this.onAttach();
        this.setName('MeshLayer');
        _scene.add(this.mesh);

    }

    onAttach = () => {
        const geometry = this.meshGeometry;
        console.log(this.materialsLibrary);

        const _mesh = new Mesh(geometry, MaterialsLibrary.materials[0]);
        this.setMesh(_mesh);
        this.start = Date.now();
    }

    onUpdate = () => {
     if(this.mesh){
        this.updateMeshMaterial();
        this.mesh.visible = this.toBeRendered;
     }
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