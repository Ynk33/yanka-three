export default class ShaderCommons {
  /**
   * Imports the common functions into a Shader body.
   * @param {string} shader The Shader body.
   * @returns {string} The Shader body with the common functions included.
   */
  static importInto(shader) {
    return shader.replace(
      `#include <commons>`,
      `
        ${ShaderCommons.remapFunction}
        ${ShaderCommons.distanceToSegment}
      `
    );
  }

  /**
   * The Shader map function.
   */
  static get remapFunction() {
    return `
      float remap(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }
    `;
  }

  static get distanceToSegment() {
    return `
    float distanceToSegment(vec2 p, vec2 a, vec2 b, float errorMargin)
    {
      // Vectors
      vec2 u = p - b;
      vec2 v = a - b;

      // Distances
      float distToA = distance(p, a);
      float distToB = distance(p, b);

      // If a and b are the same point, skip projection
      float lengthV = length(v);
      if (lengthV == 0.0) {
        return distToA;
      }

      // Projection
      vec2 proj = b + (dot(u, v) / pow(lengthV, 2.0)) * v;

      // Distance from projection
      float dist = distance(p, proj);

      // Is projection on (a,b) segment?
      bool isOnSegment = distance(p, a) + distance(p, b) <= distance(a, b) + errorMargin;


      if (isOnSegment) {
        return dist;
      }
      else {
        return min(distToA, distToB);
      }
    }
    `;
  }
}
