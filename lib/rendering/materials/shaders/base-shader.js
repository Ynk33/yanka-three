import * as THREE from "three";
import ShaderCommons from "./common/shader-commons";

export default class BaseShader {
  /**
   * This Shader's uniforms.
   * @type {{[uniform: string]: THREE.IUniform}}
   */
  _uniforms = {};

  /**
   * This Shader's skeleton.
   * @type {string}
   */
  _skeleton = ``;

  /**
   * This Shader's main function.
   * @type {string}
   */
  _main = ``;

  /**
   * This Shader's uniforms default values specified on constructor.
   * @type {{[uniform: string]: any}}
   */
  _uniformCustomDefaultValues = {};

  /**
   * Instantiates a new Shader with some default uniform values.
   * @param {{[key: string]: any}} [uniformDefaultValues={}]
   */
  constructor(uniformDefaultValues = {}) {
    this._uniformCustomDefaultValues = uniformDefaultValues;
  }

  /**
   * Getter for this Shader's uniforms.
   * @returns {{[uniform: string]: THREE.IUniform}}
   */
  get uniforms() {
    // Set uniforms' custom default values.
    Object.entries(this._uniformCustomDefaultValues).forEach(([key, value]) => {
      if (this._uniforms[key]) {
        this._uniforms[key].value = value;
      }
    });

    return this._uniforms;
  }

  /**
   * Getter for this Shader's main function.
   * @returns {string}
   */
  get main() {
    return this._main;
  }

  /**
   * Getter for this shader body.
   * @returns {string}
   */
  get body() {
    return ShaderCommons.importInto(
      this._skeleton
        .replace(`#include <uniforms>`, this.#formatUniforms())
        .replace(`#include <main>`, this._main)
    );
  }

  /**
   * Updates the Material's uniforms.
   * @param {THREE.ShaderMaterial} material Material to update.
   * @param {number} [scale=1] Render scale.
   * @param {any} [args={}] Optional args to pass to the Shader.
   */
  update(material, scale = 1, args = {}) {
    Object.entries(args).forEach(([key, value]) => {
      if (material.uniforms[key]) material.uniforms[key].value = value;
    });
  }

  /**
   * Format this Shader's uniforms into a format to be included in a Shader body.
   * @returns {string}
   */
  #formatUniforms() {
    return Object.entries(this._uniforms)
      .map((uniform) => {
        const [key, value] = uniform;
        return `uniform ${value.type} ${key};`;
      })
      .join(`\n`);
  }
}
