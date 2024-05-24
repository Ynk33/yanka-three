import * as THREE from "three";

export default class Screen {
  /**
   * Singleton reference.
   */
  static #instance;

  /**
   * Returns the Window singleton.
   * @returns {Screen}
   */
  static #getInstance() {
    if (!Screen.#instance) {
      Screen.#instance = new Screen();
    }

    return Screen.#instance;
  }

  /**
   * The Window size.
   * @type {THREE.Vector2}
   */
  #size;

  /**
   * Instantiates a new Window object.
   */
  constructor() {
    this.#setSize();

    window.addEventListener("resize", () => this.#setSize());
  }

  /**
   * Initializes the singleton/
   */
  static init() {
    Screen.#getInstance();
  }

  /**
   * Returns the Window's size.
   * @returns {THREE.Vector2}
   */
  static get size() {
    return Screen.#getInstance().#size;
  }

  #setSize() {
    this.#size = new THREE.Vector2(window.innerWidth, window.innerHeight);
  }
}
