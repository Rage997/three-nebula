import BaseRenderer from './BaseRenderer';
import { PUID } from '../utils';
import { Pool } from '../core';
import { RENDERER_TYPE_MESH as type } from './types';

/**
 * MeshRenderer class for rendering particles as 3D meshes.
 * @extends BaseRenderer
 */
export default class MeshRenderer extends BaseRenderer {
  /**
   * Creates a new MeshRenderer instance.
   * @param {THREE.Object3D} container - An Object3D container, usually a THREE.Scene.
   * @param {THREE} THREE - The THREE.js API.
   */
  constructor(container, THREE) {
    super(type);

    this.container = container;
    this._targetPool = new Pool();
    this._materialPool = new Pool();
    this._body = new THREE.Mesh(
      new THREE.BoxGeometry(50, 50, 50),
      new THREE.MeshLambertMaterial({ color: '#ff0000' })
    );
  }

  /**
   * Checks if a particle target is a sprite.
   * @param {Particle} particle - The particle to check.
   * @returns {boolean} - True if the particle target is a sprite, false otherwise.
   */
  isThreeSprite(particle) {
    return particle.target.isSprite;
  }

  /**
   * No-op method for handling system updates. Provided for consistency with other renderers.
   */
  onSystemUpdate() {}

  /**
   * Called when a new particle is created. Initializes the particle target and material.
   * @param {Particle} particle - The particle being created.
   */
  onParticleCreated(particle) {
    // Set target
    if (!particle.target) {
      if (!particle.body) particle.body = this._body;
      particle.target = this._targetPool.get(particle.body);

      // Set material
      if (particle.useAlpha || particle.useColor) {
        particle.target.material.__puid = PUID.id(particle.body.material);
        particle.target.material = this._materialPool.get(
          particle.target.material
        );
      }
    }

    // Add particle target to the container
    if (particle.target) {
      particle.target.position.copy(particle.position);
      this.container.add(particle.target);
    }
  }

  /**
   * Called when a particle is updated. Updates the particle target's position, rotation, scale, and material properties.
   * @param {Particle} particle - The particle being updated.
   */
  onParticleUpdate(particle) {
    const { target, useAlpha, useColor } = particle;

    if (!target) {
      return;
    }

    // Update position
    target.position.copy(particle.position);

    // Update rotation
    this.rotate(particle);

    // Update scale
    this.scale(particle);

    // Update material opacity if using alpha
    if (useAlpha) {
      target.material.opacity = particle.alpha;
      target.material.transparent = true;
    }

    // Update material color if using color
    if (useColor) {
      target.material.color.copy(particle.color);
    }
  }

  /**
   * Updates the particle target's rotation based on the particle's rotation.
   * @param {Particle} particle - The particle to update.
   */
  rotate(particle) {
    particle.target.rotation.set(particle.rotation.x, particle.rotation.y, particle.rotation.z);
  }

  /**
   * Updates the particle target's scale based on the particle's scale.
   * @param {Particle} particle - The particle to update.
   */
  scale(particle) {
    particle.target.scale.set(particle.scale, particle.scale, particle.scale);
  }

  /**
   * Called when a particle dies. Cleans up the particle target and material.
   * @param {Particle} particle - The particle that has died.
   */
  onParticleDead(particle) {
    if (particle.target) {
      // Expire material if using alpha or color
      if (particle.useAlpha || particle.useColor) {
        this._materialPool.expire(particle.target.material);
      }

      // Expire target and remove it from the container
      this._targetPool.expire(particle.target);
      this.container.remove(particle.target);
      particle.target = null;
    }
  }
}
