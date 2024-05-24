import * as THREE from "three";
import Shape from "./shape";

export default class Line extends Shape {
  _validate(args) {
    const errors = super._validate(args);

    if (!args.points) {
      errors.push("Missing points args");
    }

    return errors;
  }

  _getGeometry(args) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(args.points);

    return geometry;
  }

  _getMesh(_args) {
    return new THREE.LineSegments(this.geometry, this.material);
  }
}
