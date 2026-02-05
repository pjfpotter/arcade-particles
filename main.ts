/**
 * Particle system for MakeCode Arcade
 */
//% weight=100 color=#FF6EC7 icon="\uf06d" block="Particles"
namespace particles {
    /**
     * Create a new particle emitter
     */
    //% blockId=particles_create_emitter
    //% block="create emitter at x $x y $y"
    //% x.defl=80 y.defl=60
    //% weight=100
    export function createEmitter(x: number, y: number): ParticleEmitter {
        return new ParticleEmitter(x, y);
    }
}
