/**
 * Particle system for MakeCode Arcade
 */
//% weight=100 color=#FF6EC7 icon="" block="Particles"
//% groups='["Create", "Settings", "Actions"]'
namespace artParticles {
    /**
     * Create a new particle emitter
     * @param x where particles appear, eg: 80
     * @param y where particles appear, eg: 60
     * @param maxParticles the most particles on screen at once, eg: 50
     */
    //% blockId=artparticles_create_emitter
    //% block="create emitter at x $x y $y || with up to $maxParticles particles"
    //% blockSetVariable=emitter
    //% x.defl=80 y.defl=60 maxParticles.defl=50
    //% expandableArgumentMode="toggle"
    //% group="Create" weight=100
    export function createEmitter(x: number, y: number, maxParticles: number = 50): ParticleEmitter {
        return new ParticleEmitter(x, y, maxParticles);
    }
}
