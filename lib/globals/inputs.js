import * as THREE from "three";
import Screen from "./screen";

export default class Inputs {
  /**
   * Singleton reference.
   */
  static #instance;

  /**
   * Returns the Input singleton.
   * @returns {Inputs}
   */
  static #getInstance() {
    if (!Inputs.#instance) {
      Inputs.#instance = new Inputs();
    }

    return Inputs.#instance;
  }

  /**
   * The current mouse position.
   * @type {THREE.Vector2}
   */
  #mousePosition = undefined;

  /**
   * Is the mouse is currently down?
   * @type {boolean}
   */
  #mouseDown = false;

  /**
   * Instantiates a new Inputs object.
   */
  constructor() {
    window.addEventListener("mousemove", (event) => this.#onMouseMove(event));
    window.addEventListener("mousedown", () => (this.#mouseDown = true));
    window.addEventListener("mouseup", () => (this.#mouseDown = false));
  }

  /**
   * Initializes the singleton/
   */
  static init() {
    Inputs.#getInstance();
  }

  /**
   * Returns the current mouse position on the screen.
   * @returns {THREE.Vector2}
   */
  static get mousePosition() {
    return Inputs.#getInstance().#mousePosition;
  }

  /**
   * Returns whether the mouse is currently down.
   * @returns {boolean}
   */
  static get mouseDown() {
    return Inputs.#getInstance().#mouseDown;
  }

  /**
   * Updates the mouse position.
   * @param {MouseEvent} event
   */
  #onMouseMove(event) {
    this.#mousePosition = new THREE.Vector2(
      event.clientX,
      Screen.size.y - event.clientY
    );
  }
}
