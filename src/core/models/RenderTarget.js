import * as THREE from "three";

class RenderTarget{
    renderTargets = [];
    constructor(numberOfCount){
        this.initializeRenderTargets(numberOfCount);
    }
     createRenderTarget(numberOfTargets){
       
        for(let i = 0; i < numberOfTargets; i++){
             this.renderTargets.push(new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight));
        }
        return this.renderTargets;
    } 

    initializeRenderTargets(numberOfCount){
        this.createRenderTarget(numberOfCount);
      }
  

}
export default RenderTarget;