export default class Chunk {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.items = [];
  }

  isInside(item) {
    return (
      item.x >= this.x &&
      item.x < this.x + this.width &&
      item.y >= this.y &&
      item.y < this.x + this.height
    );
  }

  add(itemToAdd) {
    let i = this.items.filter((item) => item === itemToAdd.id);
    if (!i) {
      this.items.push(itemToAdd);
    }
  }

  remove(itemtoRemove) {
    let i = this.items.filter((item) => item.id === itemtoRemove);
    if (i) {
      this.items = this.items.splice(this.items.indexOf(i), 1);
    }
  }
}
