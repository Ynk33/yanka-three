import * as THREE from "three";
import CanvasObject from "../../canvas/canvas-object";
import Chunk from "./chunk";
import ChunksDebugger from "./chunks-debugger";

export default class Chunks extends CanvasObject {
  constructor(canvas, colCount, rowCount, debug = false) {
    super();

    this.canvas = canvas;
    this.colCount = colCount;
    this.rowCount = rowCount;
    this.debug = debug;

    this.#initChunks();
  }

  #initChunks() {
    this.chunks = [];

    const chunkWidth = this.canvas.width / this.colCount;
    const chunkHeight = this.canvas.height / this.rowCount;

    for (let x = 0; x < this.colCount; x++) {
      for (let y = 0; y < this.rowCount; y++) {
        const coordinates = new THREE.Vector3(
          this.canvas.x + chunkWidth * x,
          this.canvas.y + chunkHeight * y,
          0
        );
        this.chunks.push(
          new Chunk(coordinates.x, coordinates.y, chunkWidth, chunkHeight)
        );
      }
    }

    if (this.debug) {
      if (this.chunksDebugger) {
        this.canvas.remove(this.chunksDebugger);
      }

      this.chunksDebugger = new ChunksDebugger(this.canvas, this.chunks);
      this.canvas.add(this.chunksDebugger);
    }
  }

  resize(_newCanvasSize) {
    this.#initChunks();
  }
}