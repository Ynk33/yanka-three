import * as THREE from "three";
import Canvas2D from "../../canvas/canvas-2d";
import TextureUtils from "../../utils/texture-utils";
import BaseShader from "../materials/shaders/base-shader";
import RenderPass from "./render-pass";

export default class MultiPass {

  /**
   * The raw definition of the RenderPasses.
   * @type {{
   *    shader: BaseShader,
  *    shaderInputKey: string,
  *    scale: number
  *  }[]}
   */
  #rawPasses = [];

  /**
   * The different RenderPass.
   * @type {RenderPass[]}
   */
  #passes;

  /**
   * Base Texture used as input for the first pass.
   * @type {THREE.DataTexture}
   */
  #baseTexture;

  /**
   * Should the result of the render be kept as an input for the next frame?
   * @type {boolean}
   */
  #keepRenderOverFrames;

  /**
   * Instantiates a new MultiPass.
   * @param {{
   *  passes: {
   *    shader: BaseShader,
   *    shaderInputKey: string,
   *    scale: number
   *  }[],
   *  keepRenderOverFrames?: boolean
   * }} args
   */
  constructor({
    passes,
    keepRenderOverFrames = false,
  }) {
    this.#rawPasses = passes;
    this.#keepRenderOverFrames = keepRenderOverFrames;
  }

  /**
   * Getter for the result of the multipass rendering.
   * @returns {THREE.Texture}
   */
  get output() {
    return this.#passes[this.#passes.length - 1].output;
  }

  /**
   * Initializes the MultiPass.
   * @param {THREE.WebGLRenderer} renderer 
   * @param {number} canvasWidth 
   * @param {number} canvasHeight 
   */
  init(renderer, canvasWidth, canvasHeight) {
    // Init RenderPasses
    this.#passes = this.#rawPasses.map((pass) => {
      return new RenderPass({
        renderer: renderer,
        width: canvasWidth,
        height: canvasHeight,
        fragmentShader: pass.shader,
        shaderInputKey: pass.shaderInputKey,
        scale: pass.scale,
      });
    });

    // Init baseTexture
    this.#baseTexture = TextureUtils.colored(0xffffff, canvasWidth, canvasHeight);
  }

  /**
   * Renders the RenderPasses.
   * @returns {THREE.Texture}
   */
  render() {
    for (let i = 0; i < this.#passes.length; i++) {
      const pass = this.#passes[i];
      pass.render(i === 0 ? this.#baseTexture : this.#passes[i - 1].output);
    }

    if (this.#keepRenderOverFrames) {
      // Save the result of the last pass back into the base texture, for the next frame.
      this.#baseTexture = this.output;
    }

    return this.output;
  }

  /**
   * Resizes the MultiPass.
   * @param {{ width: number, height: number }} newCanvasSize 
   */
  resize(newCanvasSize) {
    // Resizes the RenderPasses
    this.#passes.forEach((pass) => {
      pass.resize(newCanvasSize);
    });

    // Resizes the baseTexture
    this.#baseTexture = TextureUtils.colored(0xffffff, newCanvasSize.width, newCanvasSize.height);
  }
}
