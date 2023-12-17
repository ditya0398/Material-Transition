STEPS TO BUILD -

-  npm i

STEPS TO RUN - 
-   npx vite

Framework Used - ThreeJS

Architecture-

    Layered Architecture - 
    
    I have implemented Layered Architecture to construct the graphics engine. Layers consist of an ordered list maintained within the layered stack. When rendering anything on the screen, the layers dictate the sequence to follow during the drawing process. It's important to note that layers aren't limited to graphics; they can also be extended to manage update events, GUI, applications, and more.

    How this layered architecture is being used?

    - Each rendering application operates with a 'game loop' or 'render loop,' continuously iterating until the game concludes. For each enabled layer within the layer stack, every layer undergoes updates i.e onUpdate() in the order it appears.
     This streamlined approach simplifies a developer's workflow. To disable a specific functionality, one simply needs to eliminate that functionality from the layer stack. That's all it takes.
      As an example, if I have a debug UI enabled during debug mode but wish to exclude it during release, I can easily eliminate the debug UI Layer from the layered stack.
    

    Key Files, Classes - 
        1) ./src/Renderer.js
        2) ./src/core/LayerStack.js 
        3) ./src/core/Layer.js
        4) ./src/core/layers/MeshLayer.js
        5) ./src/core/utils/MaterialsLibrary.js
        6) ./src/core/utils/Interpolators.js
        7) ./src/core/controllers/MeshController.js
    

    The entry point of the app is ./main.js. 

    Please check the initializeLayers() and render() function from Renderer.js to see how layers are being pushed.  
    
    Each mesh serves as a layer within the engine, with mesh and materials intricately linked. The application is interactive, featuring a UI for seamlessly transitioning between materials and meshes.
     when a mesh is selected, the visibility of its corresponding layer is toggled. Materials are loaded during initialization and can be switched for the specific active mesh. 
     All the materials have been stored inside the Materials Library.

     Interpolation Logic : I utilized two render targets by rendering distinct materials into each one separately. Afterward, I employed these render targets as textures for the final framebuffer (render target),
                            enabling me to perform interpolation between them. This approach allows you to provide any pair of materials, whether they are colors, textures, or any other type, and seamlessly interpolate them on the canvas.



