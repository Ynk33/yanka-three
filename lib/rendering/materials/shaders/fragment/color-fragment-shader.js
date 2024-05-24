import * as THREE from "three";
import BaseFragmentShader from "./base-fragment-shader";
import TextureUtils from "../../../../utils/texture-utils";

export default class ColorFragmentShader extends BaseFragmentShader {
  /**
   * This Shader's uniforms.
   * @type {{[uniform: string]: THREE.IUniform}}
   */
  _uniforms = {
    map: { type: "sampler2D", value: TextureUtils.white(512, 512) },
    color: { type: "vec3", value: new THREE.Color(0xffffff) },
  };

  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      gl_FragColor = texture(map, vUv) * vec4(color.xyz, 1.0);
    }
  `;
}
