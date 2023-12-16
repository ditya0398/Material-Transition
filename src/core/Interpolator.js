import { fragmentShaderLinearInterpolation, fragmentShaderNoiseInterpolation, fragmentShaderSmoothStepInterpolator, vertexShaderCommon, vertexShaderFinal } from "./shaders";
import * as THREE from "three";
import { ShaderMaterial } from "three";
class Interpolators{
    static interpolators = [];
    constructor(){
        this.initializeInterpolators();
    }
    addInterpolator = (_vertexShader, _fragmentShader, _name) => {
        
        const _interpolator = new ShaderMaterial({
            name: _name,
            uniforms: {
                tPrevious: {type: 't', value: null},
                tPrevious1: {type: 't', value: null},
                time: {type: 'f', value: 0.0}
              },
            vertexShader: _vertexShader(),
            fragmentShader: _fragmentShader()
        });
    Interpolators.interpolators.push(_interpolator);
    }

    initializeInterpolators = () => {
        this.addInterpolator(vertexShaderFinal, fragmentShaderLinearInterpolation, 'Linear');
        this.addInterpolator(vertexShaderFinal, fragmentShaderNoiseInterpolation, 'Noise');
        this.addInterpolator(vertexShaderFinal, fragmentShaderSmoothStepInterpolator, 'SmoothStep');
        this.addInterpolator(vertexShaderFinal, fragmentShaderSmoothStepInterpolator, 'Hermite Spline');
    }


}

export default Interpolators;
