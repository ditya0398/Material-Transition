import { fragmentShaderLinearInterpolation, fragmentShaderNoiseInterpolation, fragmentShaderExponentialInterpolator, fragmentShaderSmoothStepInterpolator, vertexShaderCommon, vertexShaderFinal } from "../shaders";
import { ShaderMaterial } from "three";
import Interpolator from "./Interpolator";

class Interpolators{
    static interpolators = [];
    static activeInterPolater;

    interPolator(_threshold, _material){
        this.threshold = _threshold,
        this.material = _material
    }
    constructor(){
        this.addInterpolator(vertexShaderFinal, fragmentShaderLinearInterpolation, 'Linear', 1.0);
        this.addInterpolator(vertexShaderFinal, fragmentShaderNoiseInterpolation, 'Noise', 1.2);
        this.addInterpolator(vertexShaderFinal, fragmentShaderSmoothStepInterpolator, 'SmoothStep', 1.0);
        this.addInterpolator(vertexShaderFinal, fragmentShaderSmoothStepInterpolator, 'Hermite Spline', 1.0);
        this.addInterpolator(vertexShaderFinal, fragmentShaderExponentialInterpolator, 'Exponential', 1.0);
        

        const length = Interpolators.interpolators.length;
        if(length > 0){
            Interpolators.activeInterPolater = Interpolators.interpolators[0];
        }
    }
    
    addInterpolator = (_vertexShader, _fragmentShader, _name, threshold) => {
        
        const _interpolatorMaterial = new ShaderMaterial({
            name: _name,
            uniforms: {
                tPrevious: {type: 't', value: null},
                tPrevious1: {type: 't', value: null},
                time: {type: 'f', value: 0.0}
              },
            vertexShader: _vertexShader(),
            fragmentShader: _fragmentShader()
        });
        
        Interpolators.interpolators.push(new Interpolator(threshold, _interpolatorMaterial));
    }
}



export default Interpolators;
