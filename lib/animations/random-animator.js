import Time from "../globals/time";
import Animator from "./animator";

export default class RandomAnimator extends Animator {
  constructor() {
    super();
  }

  update() {
    super.update();

    this.target.mesh.rotation.x += Time.deltaTime;
    this.target.mesh.rotation.y += Time.deltaTime;
  }
}