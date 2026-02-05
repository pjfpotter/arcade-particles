namespace particles {
    /**
     * Manages a pool of particles and emits them over time
     */
    export class ParticleEmitter {
        // Pool of particles (reused)
        private particles: Particle[];
        private maxParticles: number;

        // Emitter position
        public x: number;
        public y: number;

        // Emission settings (we'll expand these)
        public enabled: boolean;
        public emissionRate: number; // particles per second

        private timeSinceLastEmit: number;

        constructor(x: number, y: number, maxParticles: number = 50) {
            this.x = x;
            this.y = y;
            this.maxParticles = maxParticles;
            this.enabled = true;
            this.emissionRate = 10; // default: 10 particles/sec
            this.timeSinceLastEmit = 0;

            // Create particle pool
            this.particles = [];
            for (let i = 0; i < maxParticles; i++) {
                this.particles.push(new Particle());
            }

            // Register update loop
            game.onUpdate(() => {
                this.update(game.currentScene().millis());
            });
        }

        /**
         * Main update loop
         */
        private update(dt: number): void {
            // Update existing particles
            for (let p of this.particles) {
                if (p.alive) {
                    p.update(dt);
                }
            }

            // Emit new particles
            if (this.enabled) {
                this.timeSinceLastEmit += dt;
                const emitInterval = 1000 / this.emissionRate;
                
                while (this.timeSinceLastEmit >= emitInterval) {
                    this.emit();
                    this.timeSinceLastEmit -= emitInterval;
                }
            }

            // Render all particles
            this.render();
        }

        /**
         * Spawn a single particle from the pool
         */
        private emit(): void {
            // Find dead particle to reuse
            let particle = this.particles.find(p => !p.alive);
            if (!particle) return; // Pool exhausted

            // Initialize particle
            particle.alive = true;
            particle.x = this.x;
            particle.y = this.y;
            particle.vx = Math.random() * 2 - 1; // Random velocity
            particle.vy = Math.random() * 2 - 1;
            particle.color = 1 + Math.floor(Math.random() * 14); // Random color
            particle.age = 0;
            particle.lifetime = 500 + Math.random() * 1000;
        }

        /**
         * Render all alive particles
         */
        private render(): void {
            for (let p of this.particles) {
                if (p.alive) {
                    screen.setPixel(Math.floor(p.x), Math.floor(p.y), p.color);
                }
            }
        }
    }
}
