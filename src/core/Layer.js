
class Layer{

    /* 
        Every layer will have three methods -
        1) onAttach() - This method will be trigerred when a layer mounts or is added into the layers stack

        2) onDetach() - This method will be trigerred when a layer is removed from the layers stack
        
        3) onUpdate() - this method will be trigerred in the rendering loop and will update itself.
    */
   
    constructor() { null };

    onAttach= () =>{
        console.log('onAttach of Layer');
    }

    onDetach= () =>{
        console.log('onDettach of Layer');
    }

    onUpdate= () =>{
        console.log('onUpdate of Layer');
    }
    
    setName = (_name) => {

    }
}

export default Layer;