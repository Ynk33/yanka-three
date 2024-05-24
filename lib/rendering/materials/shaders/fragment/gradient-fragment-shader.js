import * as THREE from "three";
import Screen from "../../../../globals/screen";
import TextureUtils from "../../../../utils/texture-utils";
import BaseFragmentShader from "./base-fragment-shader";

export default class GradientFragmentShader extends BaseFragmentShader {
  /**
   * This Shader's uniforms.
   * @type {{[uniform: string]: THREE.IUniform}}
   */
  _uniforms = {
    baseTexture: { type: "sampler2D", value: TextureUtils.white(512, 512) },
    toColor: { type: "vec3", value: new THREE.Color(0x00ffff) },
    screenSize: { type: "vec2", value: Screen.size },
  };

  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      vec4 pixel = texture(baseTexture, vUv);
      float t = gl_FragCoord.x / screenSize.x;
      gl_FragColor = mix(pixel, vec4(toColor.xyz, 1.0), t);
    }
  `;
}
