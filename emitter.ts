namespace particles {
    /**
     * Manages a pool of particles and emits them over time
     */
    export class ParticleEmitter {
        private particles: ArtParticle[];
        private maxParticles: number;
        public x: number;
        public y: number;
        public enabled: boolean;
        public emissionRate: number;
        private timeSinceLastEmit: number;
        private lastUpdateTime: number;

        constructor(x: number, y: number, maxParticles: number = 50) {
            this.x = x;
            this.y = y;
            this.maxParticles = maxParticles;
            this.enabled = true;
            this.emissionRate = 10;
            this.timeSinceLastEmit = 0;
            this.lastUpdateTime = game.runtime();

            this.particles = [];
            for (let i = 0; i < maxParticles; i++) {
                this.particles.push(new ArtParticle());
            }

            game.onUpdate(() => {
                this.update();
            });
        }

        private update(): void {
            const currentTime = game.runtime();
            const dt = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;

            for (let p of this.particles) {
                if (p.alive) {
                    p.update(dt);
                }
            }

            if (this.enabled) {
                this.timeSinceLastEmit += dt;
                const emitInterval = 1000 / this.emissionRate;
                
                while (this.timeSinceLastEmit >= emitInterval) {
                    this.emit();
                    this.timeSinceLastEmit -= emitInterval;
                }
            }

            this.render();
        }

        private emit(): void {
            let particle = this.particles.find(p => !p.alive);
            if (!particle) return;

            particle.alive = true;
            particle.x = this.x;
            particle.y = this.y;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            
            particle.color = 1 + Math.floor(Math.random() * 14);
            particle.age = 0;
            particle.lifetime = 500 + Math.random() * 1500;
        }

        private render(): void {
            for (let p of this.particles) {
                if (p.alive) {
                    const px = Math.floor(p.x);
                    const py = Math.floor(p.y);
                    
                    if (px >= 0 && px < screen.width && py >= 0 && py < screen.height) {
                        screen.setPixel(px, py, p.color);
                    }
                }
            }
        }

        public stop(): void {
            this.enabled = false;
        }

        public start(): void {
            this.enabled = true;
        }

        public clear(): void {
            for (let p of this.particles) {
                p.alive = false;
            }
        }
    }
}
