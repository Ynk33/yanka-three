import * as THREE from "three";
import BaseFragmentShader from "./base-fragment-shader";
import Time from "../../../../globals/time";
import CustomMaterial from "../../custom-material";
import TextureUtils from "../../../../utils/texture-utils";

/**
 * Fragment shader that pulses between 2 colors over time.
 * @class PulseFragmentShader
 * @extends BaseFragmentShader
 */
export default class PulseFragmentShader extends BaseFragmentShader {
  /**
   * This Shader's uniforms.
   * @type {{[uniform: string]: THREE.IUniform}}
   */
  _uniforms = {
    time: { type: "float", value: 0 },
    baseTexture: { type: "sampler2D", value: TextureUtils.white(512, 512) },
    color: { type: "vec3", value: new THREE.Color(0x0000ff) },
  };

  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      float t = remap(sin(time), -1.0, 1.0, 0.0, 1.0);
      gl_FragColor = mix(texture(baseTexture, vUv), vec4(color, 1.0), t);
    }
  `;

  /**
   * Updates the Material's uniforms.
   * @param {CustomMaterial} material Material to update.
   * @param {number} [scale=1] Render scale.
   * @param {{texture: THREE.Texture | THREE.RenderTarget}} [args={}] Optional args to pass to the Shader.
   */
  update(material, scale = 1, args = {}) {
    super.update(material, scale, args);

    if (material.uniforms.time) material.uniforms.time.value = Time.elapsedTime;
  }
}
