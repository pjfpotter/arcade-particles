namespace artParticles {
    /**
     * A single particle with position, velocity, and visual properties
     * Named ArtParticle to avoid confusion with Arcade's built-in Particle class
     */
    export class ArtParticle {
        // Position (use regular numbers, convert to int when rendering)
        public x: number;
        public y: number;

        // Velocity in pixels per second
        public vx: number;
        public vy: number;

        // Visual
        public color: number;
        public size: number; // side of the square in pixels

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
            this.size = 1;
            this.age = 0;
            this.lifetime = 1000; // ms
            this.alive = false;
        }

        /**
         * Update particle physics
         * @param dt Delta time in milliseconds
         * @param ax Acceleration in pixels per second squared
         * @param ay Acceleration in pixels per second squared
         */
        public update(dt: number, ax: number, ay: number): void {
            if (!this.alive) return;

            const seconds = dt / 1000;
            this.vx += ax * seconds;
            this.vy += ay * seconds;
            this.x += this.vx * seconds;
            this.y += this.vy * seconds;

            // Update age
            this.age += dt;

            // Check if expired
            if (this.age >= this.lifetime) {
                this.alive = false;
            }
        }
    }
}
