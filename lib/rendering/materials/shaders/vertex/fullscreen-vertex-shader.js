import BaseVertexShader from "./base-vertex-shader";

export default class FullScreenVertexShader extends BaseVertexShader {
  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      vPosition = position;
      vNormal = normal;
      
      vUv = uv;
      vUv = vUv - vec2(0.5, 0.5);
      vUv = vUv * vec2(2.0, 2.0);

      gl_Position = vec4(vUv.xy, 0.0, 1.0);
    }
  `;
}
