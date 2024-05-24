export default class ChunkItem {
  constructor(id) {
    this.id = id;
  }

  update(position) {
    this.position = position;
  }

  x = () => {
    return this.position.x;
  }

  y = () => {
    return this.position.y;
  }
}