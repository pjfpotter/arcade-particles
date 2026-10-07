namespace artParticles {
    // Above sprites (default z 0), below the HUD (scene.HUD_Z)
    const DEFAULT_Z = 50;
    // Longest step simulated in one frame, so a stall doesn't cause a jump
    const MAX_DT = 100;

    // game.onUpdate handlers can't be unregistered, so one shared handler
    // drives every live emitter
    let emitters: ParticleEmitter[] = [];
    let updaterRegistered = false;
    let lastUpdateTime = 0;

    function registerEmitter(emitter: ParticleEmitter): void {
        emitters.push(emitter);
        if (updaterRegistered) return;

        updaterRegistered = true;
        lastUpdateTime = game.runtime();
        game.onUpdate(() => {
            const currentTime = game.runtime();
            const dt = Math.min(currentTime - lastUpdateTime, MAX_DT);
            lastUpdateTime = currentTime;

            for (let e of emitters) {
                e.update(dt);
            }
        });
    }

    /**
     * Manages a pool of particles and emits them over time
     */
    //% blockNamespace=artParticles
    export class ParticleEmitter {
        private particles: ArtParticle[];
        private maxParticles: number;
        private renderable: scene.Renderable;
        private nextFree: number;
        private timeSinceLastEmit: number;
        private destroyed: boolean;

        public x: number;
        public y: number;
        public enabled: boolean;
        public emissionRate: number; // particles per second
        public speedMin: number; // pixels per second
        public speedMax: number;
        public lifetimeMin: number; // ms
        public lifetimeMax: number;
        public direction: number; // degrees, 0 = right, 90 = down
        public spread: number; // total cone width in degrees
        public colors: number[];
        public gravityX: number; // pixels per second squared
        public gravityY: number;
        public size: number;

        constructor(x: number, y: number, maxParticles: number = 50) {
            this.x = x;
            this.y = y;
            this.maxParticles = Math.max(1, Math.floor(maxParticles));
            this.enabled = true;
            this.emissionRate = 10;
            this.speedMin = 30;
            this.speedMax = 120;
            this.lifetimeMin = 500;
            this.lifetimeMax = 2000;
            this.direction = 0;
            this.spread = 360;
            this.colors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
            this.gravityX = 0;
            this.gravityY = 0;
            this.size = 1;
            this.nextFree = 0;
            this.timeSinceLastEmit = 0;
            this.destroyed = false;

            this.particles = [];
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push(new ArtParticle());
            }

            // Draw in the scene's render pass; pixels set during onUpdate
            // are overwritten when the background is painted
            this.renderable = scene.createRenderable(DEFAULT_Z, (target: Image, camera: scene.Camera) => {
                this.render(target);
            });

            registerEmitter(this);
        }

        /**
         * Advance the simulation. Called once per frame by the shared updater.
         * @param dt Delta time in milliseconds
         */
        public update(dt: number): void {
            for (let p of this.particles) {
                if (p.alive) {
                    p.update(dt, this.gravityX, this.gravityY);
                }
            }

            if (this.enabled && this.emissionRate > 0) {
                this.timeSinceLastEmit += dt;
                const emitInterval = 1000 / this.emissionRate;

                while (this.timeSinceLastEmit >= emitInterval) {
                    this.timeSinceLastEmit -= emitInterval;
                    if (!this.emit()) {
                        // Pool is full; drop the backlog rather than spin
                        this.timeSinceLastEmit = 0;
                        break;
                    }
                }
            }
        }

        // Returns false if every particle in the pool is in use
        private emit(): boolean {
            let particle: ArtParticle = null;
            for (let i = 0; i < this.maxParticles; i++) {
                const index = (this.nextFree + i) % this.maxParticles;
                if (!this.particles[index].alive) {
                    particle = this.particles[index];
                    this.nextFree = (index + 1) % this.maxParticles;
                    break;
                }
            }
            if (!particle) return false;

            particle.alive = true;
            particle.x = this.x;
            particle.y = this.y;

            const degrees = this.direction + randomRange(-this.spread / 2, this.spread / 2);
            const angle = degrees * Math.PI / 180;
            const speed = randomRange(this.speedMin, this.speedMax);
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;

            particle.color = this.colors[randomInt(0, this.colors.length - 1)];
            particle.size = this.size;
            particle.age = 0;
            particle.lifetime = randomRange(this.lifetimeMin, this.lifetimeMax);
            return true;
        }

        private render(target: Image): void {
            for (let p of this.particles) {
                if (p.alive) {
                    const px = Math.floor(p.x);
                    const py = Math.floor(p.y);

                    if (p.size > 1) {
                        const half = p.size >> 1;
                        target.fillRect(px - half, py - half, p.size, p.size, p.color);
                    } else if (px >= 0 && px < target.width && py >= 0 && py < target.height) {
                        target.setPixel(px, py, p.color);
                    }
                }
            }
        }

        /**
         * Move the point that particles are emitted from
         */
        //% blockId=artparticles_set_position
        //% block="set $this position to x $x y $y"
        //% this.shadow=variables_get this.defl=emitter
        //% x.defl=80 y.defl=60
        //% group="Settings" weight=100
        public setPosition(x: number, y: number): void {
            this.x = x;
            this.y = y;
        }

        /**
         * Set how many particles are emitted each second
         */
        //% blockId=artparticles_set_rate
        //% block="set $this rate to $rate particles per second"
        //% this.shadow=variables_get this.defl=emitter
        //% rate.defl=10 rate.min=0
        //% group="Settings" weight=95
        public setRate(rate: number): void {
            this.emissionRate = Math.max(0, rate);
        }

        /**
         * Set the speed range of new particles, in pixels per second
         */
        //% blockId=artparticles_set_speed
        //% block="set $this speed from $min to $max"
        //% this.shadow=variables_get this.defl=emitter
        //% min.defl=30 max.defl=120
        //% group="Settings" weight=90
        public setSpeed(min: number, max: number): void {
            this.speedMin = Math.min(min, max);
            this.speedMax = Math.max(min, max);
        }

        /**
         * Set the direction new particles travel in. 0 is right, 90 is down.
         */
        //% blockId=artparticles_set_direction
        //% block="set $this direction to $degrees °"
        //% this.shadow=variables_get this.defl=emitter
        //% degrees.defl=270
        //% group="Settings" weight=85
        public setDirection(degrees: number): void {
            this.direction = degrees;
        }

        /**
         * Set how wide the cone of particles is around the direction.
         * 0 is a straight line, 360 is every direction.
         */
        //% blockId=artparticles_set_spread
        //% block="set $this spread to $degrees °"
        //% this.shadow=variables_get this.defl=emitter
        //% degrees.defl=45 degrees.min=0 degrees.max=360
        //% group="Settings" weight=80
        public setSpread(degrees: number): void {
            this.spread = Math.constrain(degrees, 0, 360);
        }

        /**
         * Set the exact velocity of new particles, in pixels per second.
         * This replaces the speed and direction and sets the spread to 0.
         */
        //% blockId=artparticles_set_velocity
        //% block="set $this velocity to vx $vx vy $vy"
        //% this.shadow=variables_get this.defl=emitter
        //% vx.defl=50 vy.defl=0
        //% group="Settings" weight=75
        public setVelocity(vx: number, vy: number): void {
            const speed = Math.sqrt(vx * vx + vy * vy);
            this.speedMin = speed;
            this.speedMax = speed;
            if (speed > 0) {
                this.direction = Math.atan2(vy, vx) * 180 / Math.PI;
            }
            this.spread = 0;
        }

        /**
         * Set the size of new particles, in pixels
         */
        //% blockId=artparticles_set_size
        //% block="set $this size to $size"
        //% this.shadow=variables_get this.defl=emitter
        //% size.defl=2 size.min=1
        //% group="Settings" weight=70
        public setSize(size: number): void {
            this.size = Math.max(1, Math.floor(size));
        }

        /**
         * Set how long new particles live, in milliseconds
         */
        //% blockId=artparticles_set_lifetime
        //% block="set $this lifetime from $min to $max ms"
        //% this.shadow=variables_get this.defl=emitter
        //% min.defl=500 max.defl=2000
        //% group="Settings" weight=65
        public setLifetime(min: number, max: number): void {
            this.lifetimeMin = Math.max(0, Math.min(min, max));
            this.lifetimeMax = Math.max(0, Math.max(min, max));
        }

        /**
         * Give every new particle the same color
         */
        //% blockId=artparticles_set_color
        //% block="set $this color to $color"
        //% this.shadow=variables_get this.defl=emitter
        //% color.shadow=colorindexpicker color.defl=5
        //% group="Settings" weight=60
        public setColor(color: number): void {
            this.setColors([color]);
        }

        /**
         * Set the colors new particles pick from at random.
         * Transparent entries are skipped.
         */
        //% blockId=artparticles_set_colors
        //% block="set $this colors to $colors"
        //% this.shadow=variables_get this.defl=emitter
        //% colors.shadow=lists_create_with colors.defl=colorindexpicker
        //% group="Settings" weight=55
        public setColors(colors: number[]): void {
            if (!colors) return;
            // Color 0 is transparent, and is what an untouched slot in the
            // block holds; particles drawn with it would be invisible
            const visible = colors.filter(c => c > 0);
            if (visible.length > 0) {
                this.colors = visible;
            }
        }

        /**
         * Set a constant pull on particles, in pixels per second squared.
         * Positive y pulls down.
         */
        //% blockId=artparticles_set_gravity
        //% block="set $this gravity to x $ax y $ay"
        //% this.shadow=variables_get this.defl=emitter
        //% ax.defl=0 ay.defl=100
        //% group="Settings" weight=50
        public setGravity(ax: number, ay: number): void {
            this.gravityX = ax;
            this.gravityY = ay;
        }

        /**
         * Set the drawing layer. Sprites are at 0 by default; higher draws on top.
         */
        //% blockId=artparticles_set_z
        //% block="set $this z to $z"
        //% this.shadow=variables_get this.defl=emitter
        //% z.defl=50
        //% group="Settings" weight=45
        public setZ(z: number): void {
            this.renderable.z = z;
        }

        /**
         * Start emitting particles
         */
        //% blockId=artparticles_start
        //% block="start $this"
        //% this.shadow=variables_get this.defl=emitter
        //% group="Actions" weight=100
        public start(): void {
            this.enabled = true;
        }

        /**
         * Stop emitting. Particles already on screen live out their lifetime.
         */
        //% blockId=artparticles_stop
        //% block="stop $this"
        //% this.shadow=variables_get this.defl=emitter
        //% group="Actions" weight=95
        public stop(): void {
            this.enabled = false;
            this.timeSinceLastEmit = 0;
        }

        /**
         * Emit a number of particles at once
         */
        //% blockId=artparticles_burst
        //% block="burst $count particles from $this"
        //% this.shadow=variables_get this.defl=emitter
        //% count.defl=20 count.min=1
        //% group="Actions" weight=90
        public burst(count: number): void {
            if (this.destroyed) return;
            for (let i = 0; i < count; i++) {
                if (!this.emit()) break;
            }
        }

        /**
         * Remove every particle from the screen
         */
        //% blockId=artparticles_clear
        //% block="clear $this"
        //% this.shadow=variables_get this.defl=emitter
        //% group="Actions" weight=85
        public clear(): void {
            for (let p of this.particles) {
                p.alive = false;
            }
        }

        /**
         * Remove the emitter and its particles for good
         */
        //% blockId=artparticles_destroy
        //% block="destroy $this"
        //% this.shadow=variables_get this.defl=emitter
        //% group="Actions" weight=80
        public destroy(): void {
            if (this.destroyed) return;
            this.destroyed = true;
            this.enabled = false;
            this.clear();
            this.renderable.destroy();
            emitters.removeElement(this);
        }
    }
}
