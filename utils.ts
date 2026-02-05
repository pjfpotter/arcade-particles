namespace particles {
    /**
     * Utility functions for particle effects
     */
    
    /**
     * Linear interpolation between two values
     */
    export function lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Random number in range
     */
    export function randomRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    /**
     * Random integer in range (inclusive)
     */
    export function randomInt(min: number, max: number): number {
        return Math.floor(randomRange(min, max + 1));
    }
}
