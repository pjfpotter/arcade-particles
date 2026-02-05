namespace particles {
    /**
     * Manages a pool of particles and emits them over time
     */
    export class ParticleEmitter {
        // Pool of particles (reused)
        private particles: ArtParticle[];
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
                this.particles.push(new ArtParticle());
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
            // Calculate delta time
            const currentTime = game.runtime();
            const dt = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;

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
            
            // Random velocity (pixels per frame at 60fps)
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            
            particle.color = 1 + Math.floor(Math.random() * 14); // Random color (1-15)
            particle.age = 0;
            particle.lifetime = 500 + Math.random() * 1500; // 0.5-2 seconds
        }

        /**
         * Render all alive particles
         */
        private render(): void {
            for (let p of this.particles) {
                if (p.alive) {
                    // Convert to integers for pixel rendering
                    const px = Math.floor(p.x);
                    const py = Math.floor(p.y);
                    
                    // Only render if on screen
                    if (px >= 0 && px < screen.width && py >= 0 && py < screen.height) {
                        screen.setPixel(px, py, p.color);
                    }
                }
            }
        }

        /**
         * Stop emitting new particles
         */
        public stop(): void {
            this.enabled = false;
        }

        /**
         * Start emitting particles
         */
        public start(): void {
            this.enabled = true;
        }

        /**
         * Kill all particles immediately
         */
        public clear(): void {
            for (let p of this.particles) {
                p.alive = false;
            }
        }
    }
}
