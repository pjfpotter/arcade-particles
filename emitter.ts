namespace particles {
    /**
     * Manages a pool of particles and emits them over time
     */
    export class ParticleEmitter {
        // Pool of particles (reused)
        private particles: ArtParticle[];  // ✅ Changed from Particle
        private maxParticles: number;

        // Emitter position
        public x: number;
        public y: number;

        // Emission settings
        public enabled: boolean;
        public emissionRate: number; // particles per second

        private timeSinceLastEmit: number;
        private lastUpdateTime: number;

        constructor(x: number, y: number, maxParticles: number = 50) {
            this.x = x;
            this.y = y;
            this.maxParticles = maxParticles;
            this.enabled = true;
            this.emissionRate = 10; // default: 10 particles/sec
            this.timeSinceLastEmit = 0;
            this.lastUpdateTime = game.runtime();

            // Create particle pool
            this.particles = [];
            for (let i = 0; i < maxParticles; i++) {
                this.particles.push(new ArtParticle());  // ✅ Changed from Particle
            }

            // Register update loop
            game.onUpdate(() => {
                this.update();
            });
        }

        /**
         * Main update loop
         */
        private update(): void {
            //
