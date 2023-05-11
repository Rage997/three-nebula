import {
  PARTICLE_CREATED,
  PARTICLE_DEAD,
  PARTICLE_UPDATE,
  SYSTEM_UPDATE,
} from '../events/constants';

import { RENDERER_TYPE_BASE } from './types';
import { __DEV__ } from '../constants';

export default class BaseRenderer {
  constructor(type = RENDERER_TYPE_BASE) {
    this.type = type;

    this.boundOnSystemUpdate = this.onSystemUpdate.bind(this);
    this.boundOnParticleCreated = this.onParticleCreated.bind(this);
    this.boundOnParticleUpdate = this.onParticleUpdate.bind(this);
    this.boundOnParticleDead = this.onParticleDead.bind(this);
  }

  setId(id) {
    this.id = id;
  }

  init(system) {
    this.system = system;

    this.system.eventDispatcher.addEventListener(SYSTEM_UPDATE, this.boundOnSystemUpdate);
    this.system.eventDispatcher.addEventListener(`${this.id}_${PARTICLE_CREATED}`, this.boundOnParticleCreated);
    this.system.eventDispatcher.addEventListener(`${this.id}_${PARTICLE_UPDATE}`, this.boundOnParticleUpdate);
    this.system.eventDispatcher.addEventListener(`${this.id}_${PARTICLE_DEAD}`, this.boundOnParticleDead);

    this.logRendererType();
  }

  destroy() {
    this.system.eventDispatcher.removeEventListener(SYSTEM_UPDATE, this.boundOnSystemUpdate);
    this.system.eventDispatcher.removeEventListener(`${this.id}_${PARTICLE_CREATED}`, this.boundOnParticleCreated);
    this.system.eventDispatcher.removeEventListener(`${this.id}_${PARTICLE_UPDATE}`, this.boundOnParticleUpdate);
    this.system.eventDispatcher.removeEventListener(`${this.id}_${PARTICLE_DEAD}`, this.boundOnParticleDead);
    this.remove();
  }

  remove() {
    this.system = null;
  }

  /**
   * @abstract
   */
  onParticleCreated(particle) {} // eslint-disable-line

  /**
   * @abstract
   */
  onParticleUpdate(particle) {} // eslint-disable-line

  /**
   * @abstract
   */
  onParticleDead(particle) {} // eslint-disable-line

  /**
   * @abstract
   */
  onSystemUpdate(system) {} // eslint-disable-line

  /**
   * Logs the renderer type being used when in development mode.
   *
   * @return void
   */
  logRendererType() {
    if (!__DEV__) {
      return;
    }

    console.log(`${this.type}`);
  }
}
