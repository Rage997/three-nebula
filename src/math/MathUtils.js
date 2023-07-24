import { PI } from '../constants';

class MathUtils {
  constructor() {
    this.setSeed();
  }

  // A pseudo-random number generator with a given seed
  SeededRandom(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  // Method to set seed. If no seed is provided, defaults to Math.random
  setSeed(seed) {
    this.myRandom = seed === undefined ? Math.random : this.SeededRandom(seed);
  }

  // Wrapper around the current random function
  myRandom() {
    return this.myRandom();
  }

  // Returns a random number between a and b. If INT is true, the number is integer.
  randomAToB(a, b, INT) {
    return !INT ? a + this.myRandom() * (b - a) : ((this.myRandom() * (b - a)) >> 0) + a;
  }

  // Returns a random number within a range around the center.
  randomFloating(center, f, INT) {
    return this.randomAToB(center - f, center + f, INT);
  }

  // Transforms a degree to radian
  degreeTransform(a) {
    return (a * PI) / 180;
  }

  // Transforms a number to hexadecimal color format
  toColor16(num) {
    return '#' + num.toString(16);
  }

  // Returns a random color in hexadecimal format
  randomColor() {
    return '#' + ('00000' + ((this.myRandom() * 0x1000000) << 0).toString(16)).slice(-6);
  }

  // Linear interpolation between a and b with a certain energy
  lerp(a, b, energy) {
    return b + (a - b) * energy;
  }

  // Get normal vector from a given vector v, normalized
  getNormal(v, n) {
    if (v.x === 0 && v.y === 0) {
      if (v.z === 0) {
        n.set(1, 0, 1);
      } else {
        n.set(1, 1, -v.y / v.z);
      }
    } else {
      if (v.x === 0) {
        n.set(1, 0, 1);
      } else {
        n.set(-v.y / v.x, 1, 1);
      }
    }

    return n.normalize();
  }

  // Perform rotation according to Rodrigues' Rotation Formula
  // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
  axisRotate(v0, v, k, tha) {
    const cos = Math.cos(tha);
    const sin = Math.sin(tha);
    const p = k.dot(v) * (1 - cos);

    v0.copy(k);
    v0.cross(v).scalar(sin);
    v0.addValue(v.x * cos, v.y * cos, v.z * cos);
    v0.addValue(k.x * p, k.y * p, k.z * p);
  }

  // Placeholder for randomZone implementation
  randomZone() {
    // Intentionally left blank. Implement as necessary.
  }
}

export default new MathUtils();
