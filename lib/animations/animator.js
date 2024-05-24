import Shape from "../shapes/shape";

export default class Animator {
  constructor() {
    this.target = undefined;
  }

  /**
   * Registers the target Shape of the animation.
   * @param {Shape} target 
   */
  register(target) {
    this.target = target;
  }

  update() {
    this._validate();
  }

  _validate() {
    if (!this.target) {
      throw new Error("No target registered.");
    }
  }
}