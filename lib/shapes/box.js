import * as THREE from "three";
import Shape from "./shape";

export default class Box extends Shape {
  _getDefaultArgs() {
    return Object.assign(super._getDefaultArgs(), { scale: 1 });
  }

  _validate(args) {
    const errors = super._validate(args);

    if (!args.scale) {
      errors.push("Missing scale args");
    }

    return errors;
  }

  _getGeometry(args) {
    return new THREE.BoxGeometry(args.scale, args.scale, args.scale);
  }

  _getMesh(_args) {
    return new THREE.Mesh(this.geometry, this.material);
  }
}
