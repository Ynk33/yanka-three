import * as THREE from "three";
import Chunks from "../perf/chunks/chunks";
import ChunksDebugger from "../perf/chunks/chunks-debugger";
import Shape from "../shapes/shape";
import CanvasObject from "./canvas-object";
import Inputs from "../globals/inputs";
import Time from "../globals/time";
import Screen from "../globals/screen";

export default class Canvas2D {
  /**
   * The main scene.
   * @type {THREE.Scene}
   */
  #scene;

  /**
   * The WebGLRenderer of the scene.
   * @type {THREE.WebGLRenderer}
   */
  #renderer;

  /**
   * The scene's camera.
   * @type {THREE.Camera}
   */
  #camera;

  /**
   * The scene's objects to render.
   * @type {CanvasObject[]}
   */
  #objects;

  /**
   * Constructor: creates a new 2D scene with a renderer, a camera, a clock and container for all the future CanvasObjects.
   * @param {Object} args 
   * @param {HTMLElement} args.container The HTML container of the canvas.
   * @param {boolean} [args.debug=false] Toggle debug mode.
   */
  constructor({ container, debug = false }) {
    this.debug = debug;
    
    this.#initGlobals();
    this.#initScene(container);
    this.#initSize(container);

    window.addEventListener("resize", () => this.#initSize(container));
  }

  /**
   * Getter for the scene's renderer.
   * @returns {THREE.WebGLRenderer} The scene's renderer.
   */
  get renderer() {
    return this.#renderer;
  }

  /**
   * Adds a new object to the 2D scene.
   * @param {CanvasObject} object
   */
  add(object) {
    switch (true) {
      case object instanceof CanvasObject:
        this.#objects.push(object);

        if (object instanceof Shape) {
          object.canvas = this;
          this.#scene.add(object.mesh);
        }
        break;

      case object instanceof ChunksDebugger:
        this.add(object.baseGrid);
        this.add(object.highlightedGrid);
        break;

      default:
        console.error(object);
        throw new Error("Cannot add " + object.constructor.name);
    }
  }

  /**
   * Removes an object from the 2D scene.
   * @param {CanvasObject} object
   */
  remove(object) {
    switch (true) {
      case object instanceof CanvasObject:
        this.#objects = this.#objects.filter((o) => o !== object);

        if (object instanceof Shape) {
          this.#scene.remove(object.mesh);
        }
        break;

      case object instanceof ChunksDebugger:
        this.remove(object.baseGrid);
        this.remove(object.highlightedGrid);
        break;

      default:
        console.error(object);
        throw new Error("Cannot remove " + object.constructor.name);
    }
  }

  /**
   * Updates the 2D scene and all its components and renders the scene.
   */
  update() {
    this.#validate();

    Time.update();

    this.#objects.forEach((object) =>
      object.update()
    );
    
    this.#renderer.setRenderTarget(null);
    this.#renderer.clear();
    this.#renderer.render(this.#scene, this.#camera);
  }

  /**
   * Initializes the Globals.
   */
  #initGlobals() {
    Inputs.init();
    Time.init();
    Screen.init();
  }

  /**
   * Initializes the 2D scene
   * @param {*} container The container of the canvas
   */
  #initScene(container) {
    this.#scene = new THREE.Scene();

    this.#renderer = new THREE.WebGLRenderer({ alpha: true });
    this.#renderer.setClearColor(0x000000, 0);
    container.appendChild(this.#renderer.domElement);

    this.#camera = new THREE.OrthographicCamera();
    this.#camera.position.z = 1000;

    this.#objects = [];

    this.add(new Chunks(this, 16, 8, this.debug));
  }

  /**
   * Initializes the size of the 2D scene based on its container position and size.
   */
  #initSize(container) {
    // Set canvas boundaries
    const boundaries = container.getBoundingClientRect();
    this.width = boundaries.width;
    this.height = boundaries.height;
    this.x = boundaries.left - this.width / 2;
    this.y = boundaries.bottom - boundaries.height - this.height / 2;

    // Set camera frustrum
    this.#camera.left = -this.width / 2;
    this.#camera.right = this.width / 2;
    this.#camera.top = this.height / 2;
    this.#camera.bottom = -this.height / 2;
    this.#camera.updateProjectionMatrix();

    // Set renderer size
    this.#renderer.setSize(this.width, this.height);

    // Notify all the objects in the canvas
    this.#objects.forEach((object) =>
      object.resize({ width: this.width, height: this.height })
    );
  }

  /**
   * Ensures the 2D scene is properly set up.
   */
  #validate() {
    if (!this.#camera) {
      throw new Error("No camera.");
    }
  }
}
