import * as THREE from "three";

export default class TextureUtils {
  /**
   * Creates a white texture.
   * @param {number} width 
   * @param {number} height 
   * @returns {THREE.DataTexture}
   */
  static white(width, height) {
    return TextureUtils.colored(0xffffff, width, height);
  }

  /**
   * Creates a colored texture.
   * @param {THREE.ColorRepresentation} [color=0xffffff] 
   * @param {number} [width=512]
   * @param {number} [height=512]  
   * @returns {THREE.DataTexture}
   */
  static colored(color = 0xffffff, width = 512, height = 512) {
    const size = width * height;
    const data = new Uint8Array(4 * size);
    color = new THREE.Color(color);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; i++) {
      const stride = i * 4;
      data[stride] = r;
      data[stride + 1] = g;
      data[stride + 2] = b;
      data[stride + 3] = 255;
    }

    // used the buffer to create a DataTexture
    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;

    return texture;
  }
}