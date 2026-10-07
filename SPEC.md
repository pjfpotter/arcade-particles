# Particles extension spec

Status: released as v0.1.0; current release is v0.1.2.

## Goal

A particle emitter for making digital art in MakeCode Arcade that is fully usable from
blocks. Someone should be able to drop an emitter on screen and shape what it does
(how many, how fast, which way, what colours, how long) without writing JavaScript.

## Where we started (v0.0.7)

One block (`create emitter at x y`). The emitter sprayed single pixels in all directions
with hardcoded speed, lifetime and colours. `start`, `stop`, `clear` existed but only from
JavaScript. Nothing was configurable and an emitter could never be removed.

## Scope for v0.1.0

### 1. Emitter settings

Each has a block, a sensible default, and can be changed while running.

| Setting | Meaning | Default |
| --- | --- | --- |
| position | x, y of the emission point | given at creation |
| rate | particles per second | 10 |
| speed | min and max, in pixels per second | 30 to 120 |
| lifetime | min and max, in ms | 500 to 2000 |
| direction | angle in degrees, 0 = right, 90 = down | 0 |
| spread | total cone width in degrees | 360 |
| colours | list of palette colours to pick from at random; transparent (0) is ignored | 1 to 14 |
| velocity | vx, vy in pixels per second; shorthand that sets speed and direction and sets spread to 0 | not set |
| gravity | constant acceleration x, y in pixels per second squared | 0, 0 |
| size | particle square side in pixels | 1 |
| z | drawing layer; sprites default to 0 | 50 |
| max particles | pool size, fixed at creation | 50 |

Speed is in pixels per second. Before v0.1.0 it was pixels per 60fps frame; the old
range (0.5 to 2 per frame) maps to the defaults above.

Settings affect particles emitted after the change. Gravity and z apply to every
particle of the emitter.

### 2. Actions

- `start` / `stop` continuous emission
- `burst n`: emit n particles at once, regardless of rate (replaces `forceEmit`)
- `clear`: kill all live particles
- `destroy`: stop, clear, and release the emitter so it no longer updates or draws

### 3. Internals

- One shared update handler walks a list of live emitters, instead of one
  `game.onUpdate` per emitter, since those handlers cannot be unregistered. `destroy`
  removes the emitter from the list and destroys its renderable.
- No allocation per frame: particles stay pooled, emission reuses dead ones.
- When the pool is full, new particles are dropped.
- The unused `alpha` field is gone. Arcade has a 16 colour palette and no transparency.
- The emitter uses the `utils.ts` random helpers; `lerp` is kept for colour over lifetime.

### 4. Testing

- `npx -y makecode build` must pass.
- `test.ts` becomes a small demo that exercises every setting and action, checked by eye
  in `npx -y makecode serve`.
- Tag each release `vX.Y.Z` to match `pxt.json`.

## Not in v0.1.0

- Presets (fire, fountain, sparkle, ...)
- Images or sprites as particles
- Collisions with sprites or tilemaps
- Surviving `game.pushScene` / `popScene`
- Colour change over a particle's lifetime (see decisions)

## Decisions

1. **Screen coordinates.** Particles ignore the camera. World space is only needed if
   emitters should sit in a scrolling level.
2. **No attach-to-sprite block** in v0.1.0. It leans toward game effects rather than art.
3. **Colour over lifetime comes next**, after v0.1.0. With no alpha, a "fade" is stepping
   through a colour list as the particle ages.
4. **Namespace is `artParticles`**, not Arcade's built-in `particles`, to avoid name
   clashes. The toolbox category is still labelled "Particles". This breaks code written
   against v0.0.x (`particles.createEmitter`).
5. **z is a setting**, defaulting to 50 (above sprites, below the HUD).
