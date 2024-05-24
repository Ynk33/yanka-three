import * as THREE from "three";
import MultiPass from "../multi-pass/multi-pass";
import BaseFragmentShader from "./shaders/fragment/base-fragment-shader";
import BaseVertexShader from "./shaders/vertex/base-vertex-shader";
import BaseShader from "./shaders/base-shader";
import Shape from "../../shapes/shape";
import Canvas2D from "../../canvas/canvas-2d";

export default class CustomMaterial extends THREE.ShaderMaterial {
  /**
   * This Material's vertex shader.
   * @type {BaseVertexShader}
   */
  #vertexShader;

  /**
   * This Material's fragment shader.
   * @type {BaseFragmentShader}
   */
  #fragmentShader;

  /**
   * This Material's RenderPasses;
   * @type {MultiPass}
   */
  #multiPass;

  /**
   * This Material's fragment shader input key, in case of applying the result of a multipass to the fragment shader.
   * @type {string}
   */
  #fragmentShaderInputKey;

  /**
   * Instantiates a new CustomMaterial.
   * @param {{vertexShader?: BaseVertexShader, fragmentShader?: BaseFragmentShader, multiPass?: MultiPass, fragmentShaderInputKey?: string}} materialOptions
   */
  constructor({ vertexShader = new BaseVertexShader(), fragmentShader = new BaseFragmentShader(), multiPass = undefined, fragmentShaderInputKey = "map" }) {
    super();

    this.#vertexShader = vertexShader;
    this.#fragmentShader = fragmentShader;
    this.#multiPass = multiPass;
    this.#fragmentShaderInputKey = fragmentShaderInputKey;

    this.#build();
  }

  /**
   * Update the material.
   */
  update() {
    this.#vertexShader.update(this);

    if (this.#multiPass) {
      const render = this.#multiPass.render();
      this.#fragmentShader.update(this, 1, { [this.#fragmentShaderInputKey]: render });
    }
    else {
      this.#fragmentShader.update(this);
    }
  }

  /**
   * Initializes this Material.
   * @param {Canvas2D} canvas 
   */
  init(canvas) {
    if (this.#multiPass) {
      this.#multiPass.init(canvas.renderer, canvas.width, canvas.height);
    }
  }

  /**
   * Resizes the material.
   * @param {{width: number, height: number}} newCanvasSize 
   */
  resize(newCanvasSize) {
    if (this.#multiPass) {
      this.#multiPass.resize(newCanvasSize);
    }
  }

  /**
   * An optional callback that is executed immediately before the shader program is compiled.
   * This function is called with the associated WebGL program parameters and renderer.
   * Useful for the modification of built-in materials.
   * @param {THREE.WebGLProgramParametersWithUniforms} shader
   */
  onBeforeCompile(shader) {
    // Declare the uniforms.
    shader = this.#importUniforms(shader);

    // Declare the Material's vertex and fragment shaders.
    shader.vertexShader = this.#vertexShader.body;
    shader.fragmentShader = this.#fragmentShader.body;
  }

  /**
   * Builds the Material's uniforms from the vertex and the fragment shaders.
   */
  #build() {
    /**
     * Generates getters and setters for the provided BaseShader's uniforms.
     * @param {BaseShader} shader 
     */
    function makeFrom(shader, self) {
      Object.entries(shader.uniforms).forEach(([uniform, value]) => {
        if (uniform in self.uniforms) {
          console.warn(
            `CustomMaterial: duplicated '${uniform}' uniform - shader compilation might fail.` +
              `To fix this, rename the ${uniform} uniform in the ${shader.constructor.name} Shader.`
          );
        }
        self.uniforms[uniform] = { value };
        if (uniform in self) {
          console.warn(
            `CustomMaterial: the material already contains a '${uniform}' property - ` +
              `getters and setters will not be set.` +
              `To fix this, rename the ${uniform} uniform in the ${shader.constructor.name} extension.`
          );
        } else {
          Object.defineProperty(self, uniform, {
            get() {
              return self.uniforms[uniform]?.value;
            },
            set(newValue) {
              if (self.uniforms) {
                self.uniforms[uniform].value = newValue;
              }
            },
          });
        }
      });
    }

    makeFrom(this.#vertexShader, this);
    makeFrom(this.#fragmentShader, this);
  }

  /**
   * Declare the Material's uniforms from its vertex and fragment shaders.
   * @param {THREE.WebGLProgramParametersWithUniforms} shader
   * @returns {THREE.WebGLProgramParametersWithUniforms}
   */
  #importUniforms(shader) {
    // Uniforms from vertex shader.
    Object.keys(this.#vertexShader.uniforms).forEach((key) => {
      shader.uniforms[key] = this.#vertexShader.uniforms[key];
    });

    // Uniforms from fragment shader.
    Object.keys(this.#fragmentShader.uniforms).forEach((key) => {
      shader.uniforms[key] = this.#fragmentShader.uniforms[key];
    });

    return shader;
  }
}
