import * as THREE from "three";
import CustomMaterial from "../materials/custom-material";
import BaseFragmentShader from "../materials/shaders/fragment/base-fragment-shader";
import BaseVertexShader from "../materials/shaders/vertex/base-vertex-shader";

export default class RenderPass {
  /**
   * The RenderPass scene.
   * @type {THREE.Scene}
   */
  #scene;

  /**
   * The main WebGLRenderer.
   * @type {THREE.WebGLRenderer}
   */
  #renderer;

  /**
   * The RenderPass RenderTarget.
   * @type {THREE.RenderTarget}
   */
  #renderTarget;

  /**
   * The RenderPass camera.
   * @type {THREE.OrthographicCamera}
   */
  #camera;

  /**
   * The Plane used to render.
   * @type {THREE.Mesh}
   */
  #plane;

  /**
   * The Shader input key.
   * @type {string}
   */
  #shaderInputKey;

  /**
   * Render scale.
   * @type {number}
   */
  #scale;

  /**
   * Shader to render.
   * @type {BaseFragmentShader}
   */
  #fragmentShader;

  /**
   * Instantiates a new RenderPass.
   * @param {{renderer: THREE.WebGLRenderer, width: number, height: number, fragmentShader:BaseFragmentShader, shaderInputKey?: string, scale?: number}} args
   */
  constructor({
    renderer,
    width,
    height,
    fragmentShader,
    shaderInputKey = "map",
    scale = 1,
  }) {
    this.#renderer = renderer;
    this.#fragmentShader = fragmentShader;
    this.#shaderInputKey = shaderInputKey;
    this.#scale = scale;

    this.#init(width, height);
  }

  get output() {
    return this.#renderTarget.texture;
  }

  /**
   * Renders the RenderPass.
   * @param {THREE.Texture} input
   */
  render(input, debug = false) {
    if (!debug) this.#renderer.setRenderTarget(this.#renderTarget);
    this.#renderer.clear();
    this.#fragmentShader.update(this.#plane.material, this.#scale, {
      [this.#shaderInputKey]: input,
    });
    this.#renderer.render(this.#scene, this.#camera);
  }

  /**
   * Resizes the RenderPass.
   * @param {{ width: number, height: number }} newCanvasSize 
   */
  resize(newCanvasSize) {
    // Resize the Camera.
    this.#camera.left = -newCanvasSize.width / 2;
    this.#camera.right = newCanvasSize.width / 2;
    this.#camera.top = newCanvasSize.height / 2;
    this.#camera.bottom = -newCanvasSize.height / 2;
    this.#camera.updateProjectionMatrix();

    // Resize plane
    this.#plane.scale.set(newCanvasSize.width, newCanvasSize.height, 1);
    
    // Resize the RenderTarget
    this.#renderTarget = new THREE.RenderTarget(
      newCanvasSize.width * this.#scale,
      newCanvasSize.height * this.#scale
    );
  }

  /**
   * Initializes the RenderPass.
   */
  #init(width, height) {
    // Scene
    this.#scene = new THREE.Scene();

    // Camera
    this.#camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2
    );
    this.#camera.position.z = 1000;

    // Plane
    this.#plane = this.#createPlane(width, height);
    this.#scene.add(this.#plane);

    // RenderTarget
    this.#renderTarget = new THREE.RenderTarget(
      width * this.#scale,
      height * this.#scale
    );
  }

  /**
   * Creates a new Plane Mesh.
   * @param {number} width
   * @param {number} height
   * @returns {THREE.Mesh} The Plane
   */
  #createPlane(width, height) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new CustomMaterial({
      vertexShader: new BaseVertexShader(),
      fragmentShader: this.#fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(width, height, 1);

    return mesh;
  }
}
