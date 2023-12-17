import Layer from "../Layer";

class SceneLayer extends Layer
{   
    scene = null;
    name = null;

    constructor(_common){
        super();
        this.scene = _common.scene;
        this.setName('Scenelayer');
    }

    getScene(){
        return this.scene;
    }
    onAttach = () => {

    }

    onDetach = () => {

    }

    onUpdate = () => {

    }

    setName = (_name) => {
        this.name = _name;
    }

}

export default SceneLayer;