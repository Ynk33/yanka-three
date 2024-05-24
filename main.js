import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL";
import Canvas2D from "./lib/canvas/canvas-2d";
import CustomMaterial from "./lib/rendering/materials/custom-material";
import DrawableFragmentShader from "./lib/rendering/materials/shaders/fragment/drawable-fragment-shader";
import TextureFragmentShader from "./lib/rendering/materials/shaders/fragment/texture-fragment-shader";
import MultiPass from "./lib/rendering/multi-pass/multi-pass";
import Plane from "./lib/shapes/plane";

// Scene
const canvas = new Canvas2D({
  container: document.getElementById("container"),
  debug: false,
});

// Objects
const multiPass = new MultiPass({
  passes: [
    {
      shader: new TextureFragmentShader(),
      scale: 1,
    },
    {
      shader: new DrawableFragmentShader({
        drawColor: new THREE.Color(0x000000),
        radius: 100,
        regenDuration: 1,
      }),
      shaderInputKey: "baseTexture",
      scale: 0.1,
    },
  ],
  keepRenderOverFrames: true,
});

const material = new CustomMaterial({
  multiPass: multiPass,
  fragmentShader: new TextureFragmentShader(),
});

const plane = new Plane({
  fullSize: true,
  material: material,
});

// Add objects to the Scene
canvas.add(plane);

// Main loop
function update() {
  canvas.update();

  requestAnimationFrame(update);
}

// Entry point
if (WebGL.isWebGLAvailable()) {
  update();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
