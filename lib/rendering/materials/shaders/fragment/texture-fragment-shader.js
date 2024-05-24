import TextureUtils from "../../../../utils/texture-utils";
import BaseFragmentShader from "./base-fragment-shader";

/**
 * Fragment shader that displays a texture.
 * @class TextureFragmentShader
 * @extends BaseFragmentShader
 */
export default class TextureFragmentShader extends BaseFragmentShader {
  /**
   * This Shader's uniforms.
   * @type {{[uniform: string]: THREE.IUniform}}
   */
  _uniforms = {
    map: { type: "sampler2D", value: TextureUtils.white(512, 512) },
  };

  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      gl_FragColor = texture(map, vUv);
    }
  `;
}
