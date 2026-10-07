# Particles Extension for MakeCode Arcade

A flexible particle emitter system for creating visual effects and digital art in
MakeCode Arcade.

## Usage

Create an emitter, then shape what it does with the **Settings** blocks.

```blocks
let emitter = artParticles.createEmitter(80, 110)
emitter.setRate(60)
emitter.setDirection(270)
emitter.setSpread(40)
emitter.setSpeed(70, 120)
emitter.setGravity(0, 140)
emitter.setColors([9, 8, 6, 1])
emitter.setSize(2)
```

## Settings

Settings apply to particles emitted after the change; particles already on screen keep
the values they were created with (gravity and z apply to all of them).

| Block | What it does | Default |
| --- | --- | --- |
| `setPosition(x, y)` | where particles appear | given at creation |
| `setRate(rate)` | particles per second | 10 |
| `setSpeed(min, max)` | speed range in pixels per second | 30 to 120 |
| `setDirection(degrees)` | 0 is right, 90 is down, 270 is up | 0 |
| `setSpread(degrees)` | width of the cone around the direction | 360 |
| `setVelocity(vx, vy)` | exact velocity in pixels per second; replaces speed and direction and sets spread to 0 | |
| `setSize(size)` | side of each square particle in pixels | 1 |
| `setLifetime(min, max)` | how long particles live, in ms | 500 to 2000 |
| `setColor(color)` / `setColors(list)` | palette colors to pick from at random; transparent is ignored | 1 to 14 |
| `setGravity(x, y)` | constant pull in pixels per second squared | 0, 0 |
| `setZ(z)` | drawing layer; sprites default to 0 | 50 |

## Actions

| Block | What it does |
| --- | --- |
| `start()` / `stop()` | turn continuous emission on or off |
| `burst(count)` | emit particles at once, even when stopped |
| `clear()` | remove every particle from the screen |
| `destroy()` | remove the emitter for good |

An emitter holds at most 50 particles at a time unless you pass a third argument to
`createEmitter`. When it is full, new particles are skipped until old ones expire.

## Development Status

This extension is in early development. Positions are in screen coordinates, so
particles do not follow a scrolling camera.

## License

MIT

## Supported targets

* for PXT/arcade
