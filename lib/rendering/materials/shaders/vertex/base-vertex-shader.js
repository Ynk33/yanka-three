import BaseShader from "../base-shader";

/**
 * Vertex shader that does nothing.
 * @class BaseVertexShader
 * @extends BaseShader
 */
export default class BaseVertexShader extends BaseShader {
  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = `
    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;

  /**
   * This Shader's Skeleton.
   * @type {string}
   */
  _skeleton = `
    // Set the precision for data types used in this shader
    precision highp float;
    precision highp int;
    
    // Variables passed from vertex to fragment shader
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    // Custom uniforms
    #include <uniforms>

    // Shader commons
    #include <commons>
    
    #include <main>
  `;
}
