import * as THREE from "three";
import Shape from "./shape";

export default class Plane extends Shape {
  /**
   * @param {Canvas2D} canvas;
   */
  set canvas(canvas) {
    super.canvas = canvas;

    this.resize({ width: canvas.width, height: canvas.height });
  }

  /**
   * Resizes the Plane.
   * @param {{width: number, height: number}} newCanvasSize 
   */
  resize(newCanvasSize) {
    super.resize(newCanvasSize);

    if (this.fullSize) {
      this.mesh.scale.set(newCanvasSize.width, newCanvasSize.height, 1);
    }
  }

  _getDefaultArgs() {
    const defaultArgs = {
      width: 1,
      height: 1,
      fullSize: false,
    };
    return Object.assign(super._getDefaultArgs(), defaultArgs);
  }

  _getGeometry(_args) {
    return new THREE.PlaneGeometry(1, 1);
  }

  _getMesh(args) {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.scale.set(args.width, args.height, 1);

    return mesh;
  }
}
