import { GUI } from "dat.gui";
import Layer from "./Layer";
import MaterialsLibrary from "./MaterialsLibrary";
import { Layers } from "./LayerStack";
import Interpolators from "./Interpolator";

class UI extends Layer{

    gui = null;
    name = null;

    constructor(){
        super();
        this.onAttach();
        this.setName('UILayer');
    }

    onAttach = () => {
        this.gui = new GUI();
        this.addMaterialsDropDown();
        this.addShapesDropDown();
        this.addInterpolatorsDropDown();
    }

    
    onDetach = () => {

    }

    onUpdate = () => {

    }

    setName = (_name) => {
      this.name = _name;
    }

    addMaterialsDropDown = () => {
      var parameters = {
        Material: MaterialsLibrary.materials[0].name,
      };
      var options = [];

      MaterialsLibrary.materials.forEach((element) => {
        options.push(element.name);
      });

      // Add a dropdown to the GUI
      var materialsDropdown = this.gui.add(parameters, 'Material', options);
      materialsDropdown.onChange(function(value) {
        MaterialsLibrary.materials.forEach((element) => {
            if(element.name === value){
              Layers.forEach((layer) => {
                if(layer.name === 'MeshLayer'){
                  layer.firstMesh.material  = layer.secondMesh.material;
                  layer.secondMesh.material =  element;
                  layer.timeDelta = 0.0;
                }
              })
            }
        })
   
      });
    }

    addInterpolatorsDropDown = () => {
      console.log(Interpolators.interpolators);
      var parameters = {
        Interpolator: Interpolators.interpolators[0].name,
      };
      var options = [];

      Interpolators.interpolators.forEach((element) => {
        options.push(element.name);
      });

      // Add a dropdown to the GUI
      var interpolatorsDropdown = this.gui.add(parameters, 'Interpolator', options);
      interpolatorsDropdown.onChange(function(value) {
        Interpolators.interpolators.forEach((interpolator) => {
          if(interpolator.name === value)
          {
          Layers.forEach((layer) => {
            if(layer.name === 'MeshLayer'){
              if(layer.getVisibility() === true){
                layer.getMesh().material = interpolator;
              }
            }
          });
        }    
        });
      });
    }

    
    addShapesDropDown = () => {
      var parameters = {
        Geometry: 'IcosahedronBufferGeometry',
      };
      var options = [];

      Layers.forEach((element) => {
        if(element.name === 'MeshLayer'){
          options.push(element.meshGeometry.type);
        }
      });

      var geometriesDropDown = this.gui.add(parameters, 'Geometry', options);

      geometriesDropDown.onChange(function(value) {
        Layers.forEach((layer) => {
          if(layer.name === 'MeshLayer'){
            if(layer.meshGeometry.type === value)
            {
              layer.setVisibility(true);
            }
            else
            {
              layer.setVisibility(false);
            }
          }
        })
   
      });
    }
}


export default UI;