import MeshRenderer from './MeshRenderer';
import { RENDERER_TYPE_SPRITE as type } from './types';

/**
 * This renderer is the most common and uses 2D images (sprites) to represent each 
 * particle. Sprites are essentially textured planes that always face the camera. 
 * This renderer is suitable for most use cases, as it provides a good balance 
 * between performance and visual quality.
 * The particles can have different textures, colors, and sizes, 
 * which can be easily adjusted to create various effects.
 * @requires THREE - { Mesh, BoxGeometry, MeshLambertMaterial, Sprite, SpriteMaterial }
 */
export default class SpriteRenderer extends MeshRenderer {
  constructor(container, THREE) {
    super(container, THREE);

    /**
     * @desc The class type.
     * @type {string}
     */
    this.type = type;
    this._body = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: 0xffffff })
    );
  }

  rotate(particle) {
    particle.target.material.rotation = particle.rotation.z;
  }

  scale(particle) {
    particle.target.scale.set(
      particle.scale * particle.radius,
      particle.scale * particle.radius,
      1
    );
  }
}
