import * as THREE from "three";
import Line from "../../shapes/line";

export default class ChunksDebugger {
  constructor(canvas, chunks, showCorners = false) {
    this.canvas = canvas;
    this.chunks = chunks;
    this.showCorners = showCorners;

    this.zIndex = this.canvas.camera.position.z - 1; // Put the grid right in front of the camera

    this.baseGrid = this.#createBaseGrid();
    this.highlightedGrid = this.#createHighlightedGrid();
  }

  #createBaseGrid() {
    const points = [];
    this.chunks.forEach((chunk) => {
      points.push(new THREE.Vector3(chunk.x, chunk.y, this.zIndex));
      points.push(
        new THREE.Vector3(chunk.x, chunk.y + chunk.height, this.zIndex)
      );

      points.push(new THREE.Vector3(chunk.x, chunk.y, this.zIndex));
      points.push(
        new THREE.Vector3(chunk.x + chunk.width, chunk.y, this.zIndex)
      );

      points.push(
        new THREE.Vector3(
          chunk.x + chunk.width,
          chunk.y + chunk.height,
          this.zIndex
        )
      );
      points.push(
        new THREE.Vector3(chunk.x, chunk.y + chunk.height, this.zIndex)
      );

      points.push(
        new THREE.Vector3(
          chunk.x + chunk.width,
          chunk.y + chunk.height,
          this.zIndex
        )
      );
      points.push(
        new THREE.Vector3(chunk.x + chunk.width, chunk.y, this.zIndex)
      );
    });

    // Corners
    if (this.showCorners) {
      points.push(new THREE.Vector3(0, 0, this.zIndex));
      points.push(
        new THREE.Vector3(
          this.canvas.x,
          this.canvas.y + this.canvas.height,
          this.zIndex
        )
      );
      points.push(new THREE.Vector3(0, 0, this.zIndex));
      points.push(new THREE.Vector3(this.canvas.x, this.canvas.y, this.zIndex));
      points.push(new THREE.Vector3(0, 0, this.zIndex));
      points.push(
        new THREE.Vector3(
          this.canvas.x + this.canvas.width,
          this.canvas.y + this.canvas.height,
          this.zIndex
        )
      );
      points.push(new THREE.Vector3(0, 0, this.zIndex));
      points.push(
        new THREE.Vector3(
          this.canvas.x + this.canvas.width,
          this.canvas.y,
          this.zIndex
        )
      );
    }

    const line = new Line({
      material: new THREE.LineBasicMaterial({ color: 0x0000ff }),
      points: points,
    });

    return line;
  }

  #createHighlightedGrid() {
    const points = [];
    this.chunks.forEach((chunk) => {
      if (chunk.items.length === 0) return;

      points.push(new THREE.Vector3(chunk.x, chunk.y, this.zIndex));
      points.push(
        new THREE.Vector3(chunk.x, chunk.y + chunk.height, this.zIndex)
      );

      points.push(new THREE.Vector3(chunk.x, chunk.y, this.zIndex));
      points.push(
        new THREE.Vector3(chunk.x + chunk.width, chunk.y, this.zIndex)
      );

      points.push(
        new THREE.Vector3(
          chunk.x + chunk.width,
          chunk.y + chunk.height,
          this.zIndex
        )
      );
      points.push(
        new THREE.Vector3(chunk.x, chunk.y + chunk.height, this.zIndex)
      );

      points.push(
        new THREE.Vector3(
          chunk.x + chunk.width,
          chunk.y + chunk.height,
          this.zIndex
        )
      );
      points.push(
        new THREE.Vector3(chunk.x + chunk.width, chunk.y, this.zIndex)
      );
    });

    const line = new Line({
      material: new THREE.LineBasicMaterial({ color: 0x00ff00 }),
      points: points,
    });

    return line;
  }
}
