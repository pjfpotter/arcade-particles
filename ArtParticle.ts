namespace particles {
    /**
     * A single particle with position, velocity, and visual properties
     * Named ArtParticle to avoid conflict with Arcade's built-in Particle class
     */
    export class ArtParticle {
        // Position (use regular numbers, convert to int when rendering)
        public x: number;
        public y: number;
        
        // Velocity (use regular numbers for simplicity)
        public vx: number;
        public vy: number;
        
        // Visual
        public color: number;
        public alpha: number; // 0-255
        
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
         * @param dt Delta time in milliseconds
         */
        public update(dt: number): void {
            if (!this.alive) return;

            // Update position (dt is in ms, divide by 16.67 to normalize to ~60fps)
            const frameScale = dt / 16.67;
            this.x += this.vx * frameScale;
            this.y += this.vy * frameScale;

            // Update age
            this.age += dt;

            // Check if expired
            if (this.age >= this.lifetime) {
                this.alive = false;
            }
        }
    }
}
