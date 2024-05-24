import * as THREE from "three";

export default class Time {
  /**
   * Singleton reference.
   */
  static #instance = null;

  /**
   * Returns the Time singleton.
   * @returns {Time}
   */
  static #getInstance() {
    if (!Time.#instance) {
      Time.#instance = new Time();
    }

    return Time.#instance;
  }

  /**
   * Internal clock.
   * @type {THREE.Clock}
   */
  #clock;

  /**
   * Time since the last frame.
   * @type {number}
   */
  #deltaTime = 0;

  /**
   * Time since the beginning of the app.
   * @type {number}
   */
  #elapsedTime = 0;

  /**
   * Instantiates a new Time object.
   */
  constructor() {
    this.#clock = new THREE.Clock();
  }

  /**
   * Initializes the singleton/
   */
  static init() {
    Time.#getInstance();
  }

  /**
   * Update the clock.
   */
  static update() {
    Time.#getInstance().#deltaTime = Time.#getInstance().#clock.getDelta();
    Time.#getInstance().#elapsedTime = Time.#getInstance().#clock.getElapsedTime(); 
  }

  /**
   * Returns the last frame render time.
   * @returns {number}
   */
  static get deltaTime() {
    return Time.#getInstance().#deltaTime
  }

  /**
   * Returns the total amount of seconds the app has been launched.
   * @returns {number}
   */
  static get elapsedTime() {
    return Time.#getInstance().#elapsedTime
  }
}