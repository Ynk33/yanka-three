import * as THREE from "three";
import Inputs from "../../../../globals/inputs";
import Screen from "../../../../globals/screen";
import Time from "../../../../globals/time";
import TextureUtils from "../../../../utils/texture-utils";
import CustomMaterial from "../../custom-material";
import BaseFragmentShader from "./base-fragment-shader";

export default class DrawableFragmentShader extends BaseFragmentShader {
  /**
   * This Shader's uniforms.
   * @type {{[uniform: string]: THREE.IUniform}}
   */
  _uniforms = {
    // Shader configuration
    drawColor: { type: "vec3", value: new THREE.Color(0x000000) },
    radius: { type: "float", value: 50 },
    regenDuration: { type: "float", value: 0 },
    // Shader input
    baseTexture: { type: "sampler2D", value: TextureUtils.white(512, 512) },
    // Automatically injected
    scale: { type: "float", value: 1 },
    isDrawing: { type: "bool", value: false },
    mousePosition: {
      type: "vec2",
      value: new THREE.Vector2(0, 0),
    },
    prevMousePosition: {
      type: "vec2",
      value: new THREE.Vector2(0, 0),
    },
    deltaTime: { type: "float", value: 0 },
  };

  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      vec2 scaledPrevMousePosition = prevMousePosition * scale;
      vec2 scaledMousePosition = mousePosition * scale;
      float scaledRadius = radius * scale;

      vec4 pixelColor = texture(baseTexture, vUv);

      float dist = distanceToSegment(gl_FragCoord.xy, scaledMousePosition, scaledPrevMousePosition, scaledRadius);

      if (isDrawing) {
        vec2 mouseInterval = scaledPrevMousePosition;
        vec2 mouseDir = scaledMousePosition - scaledPrevMousePosition;
        vec2 step = normalize(mouseDir) * (scaledRadius / (4.0));
        float maxDistance = distance(scaledPrevMousePosition, scaledMousePosition);

        float stepDistance = distance(scaledPrevMousePosition, mouseInterval);
        while (stepDistance <= maxDistance) {
          float distInterval = distance(gl_FragCoord.xy, mouseInterval);
          float t = 1.0 - min(distInterval / scaledRadius, 1.0);
          pixelColor = mix(pixelColor, vec4(drawColor.xyz, 1.0), t);
  
          mouseInterval += step;
          stepDistance = distance(scaledPrevMousePosition, mouseInterval);
        }
      }

      if (regenDuration > 0.0 && (!isDrawing || dist > scaledRadius)) {
        pixelColor += deltaTime / regenDuration;
      }

      gl_FragColor = vec4(pixelColor.xyz, 1.0);
    }
  `;

  #isDrawing = false;
  #prevMousePosition;

  /**
   * Updates the Material's uniforms.
   * @param {CustomMaterial} material Material to update.
   * @param {number} [scale=1] Render scale.
   * @param {{texture: THREE.Texture | THREE.RenderTarget}} [args={}] Optional args to pass to the Shader.
   */
  update(material, scale = 1, args = {}) {
    super.update(material, scale, args);

    if (material.uniforms.scale)
      material.uniforms.scale.value = scale;

    if (material.uniforms.isDrawing) {
      const isDrawing = Inputs.mouseDown;

      // Reset prevMousePosition if starts drawing.
      if (!this.#isDrawing && isDrawing) {
        this.#prevMousePosition = Inputs.mousePosition;
      }

      material.uniforms.isDrawing.value = isDrawing;
      this.#isDrawing = isDrawing;
    }

    if (this.#isDrawing && material.uniforms.prevMousePosition) {
      material.uniforms.prevMousePosition.value = this.#prevMousePosition;
    }

    if (Inputs.mousePosition && material.uniforms.mousePosition) {
      material.uniforms.mousePosition.value = Inputs.mousePosition;
      this.#prevMousePosition = Inputs.mousePosition;
    }

    if (material.uniforms.deltaTime)
      material.uniforms.deltaTime.value = Time.deltaTime;
  }
}
