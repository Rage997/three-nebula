import Zone from './Zone';
import { ZONE_TYPE_MESH as type } from './types';
import { Vector3 } from 'three';
import { MathUtils } from '../math';

/**
 * Uses a three THREE.BufferGeometry to determine the zone parameters.
 *
 */
export default class MeshZone extends Zone {
  /**
   * @constructs {MeshZone}
   *
   * @param {THREE.BufferGeometry|Mesh} bounds - the geometry or mesh that will determine the zone bounds
   * @param {number} scale - the zone scale
   * @return void
   */
  constructor(bounds, scale = 1) {
    super(type);

    this.geometry = null;
    this.scale = scale;
    this.supportsCrossing = false;

    if (bounds.type && bounds.type === 'BufferGeometry') {
      this.geometry = bounds;
    } else if (bounds.geometry) {
      this.geometry = bounds.geometry;
    } else if (bounds.type && bounds.type === 'Object3D') {
      bounds.traverse((child) => {
        if (!this.geometry && child.geometry) {
          this.geometry = child.geometry;
        }
      });
    }

    if (!this.geometry) {
      throw new Error(
        'MeshZone unable to set geometry from the supplied bounds'
      );
    }
  }

  /**
   * Returns true to indicate this is a MeshZone.
   *
   * @return {boolean}
   */
  isMeshZone() {
    return true;
  }

  getPosition() {
    const positionAttribute = this.geometry.getAttribute('position');
    const randomIndex = (positionAttribute.count * MathUtils.myRandom()) >> 0;

    const x = positionAttribute.getX(randomIndex) * this.scale;
    const y = positionAttribute.getY(randomIndex) * this.scale;
    const z = positionAttribute.getZ(randomIndex) * this.scale;

    this.vector = new Vector3(x, y, z);

    return this.vector;
  }
}
