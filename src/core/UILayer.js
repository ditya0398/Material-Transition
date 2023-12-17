import { GUI } from "dat.gui";
import Layer from "./Layer";
import MaterialsLibrary from "./MaterialsLibrary";
import { Layers } from "./LayerStack";
import Interpolators from "./utils/Interpolators";
import ControlPanelController from "./ControlPanelController";

class UILayer extends Layer{

    gui = null;
    name = null;

    constructor(){
        super();
        this.onAttach();
        this.setName('UILayer');
    }

    onAttach = () => {
        this.gui = new GUI();
        const controlPanel = new ControlPanelController(this.gui);
        controlPanel.addMaterialsDropDown();
        controlPanel.addShapesDropDown();
        controlPanel.addInterpolatorsDropDown();
    }

    onDetach = () => {

    }

    onUpdate = () => {

    }

    setName = (_name) => {
      this.name = _name;
    }  
}


export default UILayer;