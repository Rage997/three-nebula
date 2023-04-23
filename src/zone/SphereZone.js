import { PI } from '../constants';
import Util from '../utils/Util';
import Vector3D from '../math/Vector3D';
import Zone from './Zone';
import { ZONE_TYPE_SPHERE as type } from './types';

/**
 * A spherical zone for particles to be emitted within.
 *
 */
export default class SphereZone extends Zone {
  /**
   * @constructs {SphereZone}
   *
   * @param {number} centerX - the sphere's center x coordinate
   * @param {number} centerY - the sphere's center y coordinate
   * @param {number} centerZ - the sphere's center z coordinate
   * @param {number} radius - the sphere's radius value
   * @return void
   */
  constructor(centerX = 0, centerY = 0, centerZ = 0, radius = 100) {
    super(type);
  
    this.x = centerX;
    this.y = centerY;
    this.z = centerZ;
    this.radius = radius;
    this.the = this.phi = 0;
  }

  /**
   * Returns true to indicate this is a SphereZone.
   *
   * @return {boolean}
   */
  isSphereZone() {
    return true;
  }

  /**
   * Sets the particle to dead if the particle collides with the sphere.
   *
   * @param {object} particle
   * @return void
   */
  _dead(particle) {
    var d = particle.position.distanceTo(this);

    if (d - particle.radius > this.radius) particle.dead = true;
  }

  /**
   * Warns that this zone does not support the _cross method.
   *
   * @return void
   */
  _cross() {
    console.warn(`${this.constructor.name} does not support the _cross method`);
  }

  getPosition() {
    const r = Math.random() * this.radius;
    const tha = Math.PI * Math.random(); //[0-pi]
    const phi = Math.PI * 2 * Math.random(); //[0-2pi]
  
    this.vector.x = this.x + r * Math.sin(tha) * Math.cos(phi);
    this.vector.y = this.y + r * Math.sin(phi) * Math.sin(tha);
    this.vector.z = this.z + r * Math.cos(tha);
  
    return this.vector;
  }
  
  _bound(particle) {
    const normal = new Vector3D();
    const v = new Vector3D();
    const d = particle.position.distanceTo(this);
  
    if (d + particle.radius >= this.radius) {
      normal
        .copy(particle.position)
        .sub(this)
        .normalize();
      v.copy(particle.velocity);
      const k = 2 * v.dot(normal);
      particle.velocity.sub(normal.scalar(k));
    }
  }
}