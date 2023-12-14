// Please check the README.txt for the detailed explanation of the layered Architecture.

// stack where all the layers are stored.
const Layers = [];

// Whatever layer you wish to add on the canvas, gets added here into the Layers stack
function PushLayer(layer)
{
    Layers.push(layer);
}

// Pops the respective layer from the Layers stack
function PopLayer(layer)
{
    Layers.pop(layer);
}

export {Layers, PushLayer, PopLayer};