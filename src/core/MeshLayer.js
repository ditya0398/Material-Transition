import * as THREE from "three";
import { IcosahedronGeometry, Mesh, PlaneGeometry } from "three";
import Layer from "./Layer";
import MaterialsLibrary from "./MaterialsLibrary";
import { Layers } from "./LayerStack";
import { fragmentShaderNoiseInterpolation, fragmentShaderHermitieInterpolation, fragmentShaderLinearInterpolation, vertexShaderCommon, vertexShaderFinal } from "./shaders";
import Interpolators from "./utils/Interpolators";
import MeshController from "./MeshController";

class MeshLayerUI extends Layer{
   
   
    name = null;
    toBeRendered = true; 
    meshController = null;
    constructor(_environment, _meshGeom, _isVisible, _renderer, _interPolationDelta){
        super();
        this.onAttach();
        this.setVisibility(_isVisible);
        this.meshController = new MeshController(_meshGeom, _environment, _renderer, _interPolationDelta);
        this.setName('MeshLayer');

    }

    onAttach = () => {
    }

    onUpdate = () => {
        if(this.meshController){
          this.meshController.renderMesh(this.toBeRendered);
        }
    }
    // Sets the visibility of the mesh 
    setVisibility = (_isVisible) => {
      this.toBeRendered = _isVisible;
      console.log(this.toBeRendered);
    }

    getVisibility = () => {
      return this.toBeRendered;
    }
   
    //sets the name of the layer
    setName = (_name) => {
      this.name = _name;
    }


}


export default MeshLayerUI;