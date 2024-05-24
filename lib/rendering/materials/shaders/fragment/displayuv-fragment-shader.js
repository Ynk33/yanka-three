import BaseFragmentShader from "./base-fragment-shader";

/**
 * Fragment shader that display the UVs of the Mesh.
 * @class DisplayUVFragmentShader
 * @extends BaseFragmentShader
 */
export default class DisplayUVFragmentShader extends BaseFragmentShader {
  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      gl_FragColor = vec4(vUv.xy, 1.0, 1.0);
    }
  `;
}
