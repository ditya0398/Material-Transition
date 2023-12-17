import { Layers } from "../LayerStack";
import MaterialsLibrary from "../utils/MaterialsLibrary";
import Interpolators from "../utils/Interpolators";

//communicator between the UI and the components
class ControlPanelController{
    gui = null;
    constructor(_gui){
        this.gui = _gui;
    }

    addInterpolatorsDropDown = () => {
       
        var parameters = {
          Interpolator: Interpolators.interpolators[0].material.name,
        };
        var options = [];
  
        Interpolators.interpolators.forEach((element) => {
            options.push(element.material.name);
        });
  
        // Add a dropdown to the GUI
        var interpolatorsDropdown = this.gui.add(parameters, 'Interpolator', options);
        
        interpolatorsDropdown.onChange(function(value) {
          Interpolators.interpolators.forEach((interpolator) => {
            if(interpolator.material.name === value)
            {
            Layers.forEach((layer) => {
              if(layer.name === 'MeshLayer'){
                if(layer.getVisibility() === true){
                  layer.meshController.setMaterial(interpolator.material);
                  Interpolators.activeInterPolater = interpolator;
                }
              }
            });
          }    
          });
        });
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
                    layer.meshController.RenderTargetComponents[0].mesh.material  =  layer.meshController.RenderTargetComponents[1].mesh.material;
                    layer.meshController.RenderTargetComponents[1].mesh.material =  element;
                    layer.meshController.resetTimeDelta();
                  }
                })
              }
          })
     
        });
      } 
    addShapesDropDown = () => {
        var parameters = {
          Geometry: 'PlaneGeometry',
        };
        var options = [];
      
        Layers.forEach((element) => {
          if(element.name === 'MeshLayer'){
            options.push(element.meshController.meshGeometry.type);
          }
        });
        parameters['Geometry'] = options[0];
        var geometriesDropDown = this.gui.add(parameters, 'Geometry', options);
  
        geometriesDropDown.onChange(function(value) {
          Layers.forEach((layer) => {
            if(layer.name === 'MeshLayer'){
              if(layer.meshController.meshGeometry.type === value)
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

export default ControlPanelController;