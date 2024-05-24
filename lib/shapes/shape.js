import * as THREE from "three";
import Canvas2D from "../canvas/canvas-2d";
import CanvasObject from "../canvas/canvas-object";
import CustomMaterial from "../rendering/materials/custom-material";

export default class Shape extends CanvasObject {
  /**
   * Canvas in which the Shape is drawn.
   * @type {Canvas2D}
   */
  _canvas = undefined;

  /**
   * Setter for this Shape's canvas.
   * @param {Canvas2D} canvas;
   */
  set canvas(canvas) {
    this._canvas = canvas;

    if (this.material instanceof CustomMaterial) {
      this.material.init(canvas);
    }
  }

  /**
   * Getter for this Shape's canvas.
   * @returns {Canvas2D}
   */
  get canvas() {
    return this._canvas;
  }

  /**
   * Instantiates a new Shape.
   */
  constructor(args) {
    super();

    args = Object.assign(this._getDefaultArgs(), args);

    // Store the args
    Object.entries(args).forEach((arg) => {
      const [key, value] = arg;
      this[key] = value;
    });

    const errors = this._validate(args);
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    this.geometry = this._getGeometry(args);
    this.material = this._getMaterial(args);
    this.mesh = this._getMesh(args);

    this.animator = args.animator;
    if (this.animator) {
      this.animator.register(this);
    }
  }

  /**
   * Updates the Shape.
   */
  update() {
    if (this.animator) this.animator.update();
    if (this.material instanceof CustomMaterial) 
      this.material.update();
  }

  /**
   * Resizes the Shape.
   * @param {{width: number, height: number}} newCanvasSize 
   */
  resize(newCanvasSize) {
    if (this.material instanceof CustomMaterial) {
      this.material.resize(newCanvasSize);
    }
  }

  _getDefaultArgs() {
    return {
      material: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      animator: undefined,
    };
  }

  _validate(args) {
    const errors = [];

    if (!args.material) {
      errors.push("Missing material args");
    }

    return errors;
  }

  /**
   * @param {any} _args 
   * @returns {THREE.BufferGeometry}
   */
  _getGeometry(_args) {}

  /**
   * @param {any} args 
   * @returns {THREE.Material}
   */
  _getMaterial(args) {
    return args.material;
  }

  /**
   * @param {any} _args
   * @returns {THREE.Mesh} 
   */
  _getMesh(_args) {}
}
