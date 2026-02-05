namespace particles {
    /**
     * A single particle with position, velocity, and visual properties
     */
    export class Particle {
        // Position
        public x: number;
        public y: number;
        
        // Velocity
        public vx: number;
        public vy: number;
        
        // Visual
        public color: number;
        public alpha: number; // 0-255 (will need custom implementation)
        
        // Lifecycle
        public age: number;
        public lifetime: number;
        public alive: boolean;

        constructor() {
            this.reset();
        }

        /**
         * Reset particle to default state (for object pooling)
         */
        public reset(): void {
            this.x = 0;
            this.y = 0;
            this.vx = 0;
            this.vy = 0;
            this.color = 1; // white
            this.alpha = 255;
            this.age = 0;
            this.lifetime = 1000; // ms
            this.alive = false;
        }

        /**
         * Update particle physics
         */
        public update(dt: number): void {
            if (!this.alive) return;

            // Update position
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            // Update age
            this.age += dt;

            // Check if expired
            if (this.age >= this.lifetime) {
                this.alive = false;
            }
        }
    }
}
