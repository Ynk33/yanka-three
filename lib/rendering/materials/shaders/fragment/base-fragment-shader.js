import BaseShader from "../base-shader";

/**
 * Fragment shader that displays a white color.
 * @class BaseFragmentShader
 * @extends BaseShader
 */
export default class BaseFragmentShader extends BaseShader {
  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  /**
   * This Shader's skeleton.
   * @type {string}
   */
  _skeleton = `
    // Set the precision for data types used in this shader
    precision highp float;
    precision highp int;
    
    // Varyings passed from the vertex shader
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec2 vUv2;
    
    // Custom uniforms
    #include <uniforms>

    // Shader commons
    #include <commons>

    #include <main>
  `;
}
