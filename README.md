# Particles for MakeCode Arcade

Make sparks, fountains, snow, fireworks and other moving dot art in
[MakeCode Arcade](https://arcade.makecode.com).

A **particle** is one small coloured dot. An **emitter** is the thing that shoots them out,
like a garden sprinkler shoots out water drops. You choose where the emitter sits, how fast
the dots fly, which way they go, what colour they are and how long they last.

**Try it first:** [open the Particle Art demo](https://arcade.makecode.com/S78723-55158-96658-11599)

## Add it to your project

1. Open your project at [arcade.makecode.com](https://arcade.makecode.com).
2. In the toolbox (the list of block colours), scroll down and click **Extensions**.
3. Paste this link into the search box and press Enter:
   `https://github.com/pjfpotter/arcade-particles`
4. Click the **particles** card.

A pink **Particles** drawer now appears at the top of your toolbox. That is where all the
blocks below live.

## Your first emitter

1. Open the **Particles** drawer.
2. Drag `set emitter to create emitter at x 80 y 60` into your `on start` block.
3. Look at the game screen. Dots should be flying out of the middle.

```blocks
let emitter = artParticles.createEmitter(80, 60)
```

The screen is 160 pixels wide and 120 pixels tall. `x` counts from the left edge and `y`
counts from the **top**, so `x 80 y 60` is the middle and `x 80 y 110` is near the bottom.

Now add more blocks underneath to change what the dots do. This one makes a blue fountain:

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

## Block reference

Every block starts with the name of an emitter. If you make more than one emitter, give
each one its own variable name so you can tell them apart.

### Create

| Block | What it does |
| --- | --- |
| `create emitter at x _ y _` | Makes a new emitter at that spot. It starts shooting straight away. |
| `create emitter at x _ y _ with up to _ particles` | The same, but you choose how many dots it may show at once. Click the **+** on the block to see this part. |

An emitter normally shows up to **50** dots at once. If it runs out, it waits for old dots
to disappear before making new ones. Ask for more if your effect looks thin, but very big
numbers can slow your game down.

### Settings

These change the dots that come out **from now on**. Dots already on screen keep going the
way they were.

| Block | What it does | Starts as |
| --- | --- | --- |
| `set emitter position to x _ y _` | Moves the emitter to a new spot. | where you created it |
| `set emitter rate to _ particles per second` | How many dots come out each second. Bigger is busier. `0` means none. | 10 |
| `set emitter speed from _ to _` | How fast dots fly, in pixels per second. Each dot picks a speed between your two numbers. Use the same number twice to make them all equal. | 30 to 120 |
| `set emitter direction to _ °` | Which way dots fly. See the direction guide below. | 0 (right) |
| `set emitter spread to _ °` | How wide the spray is. `0` is a thin straight line, `90` is a wide cone, `360` is every direction. | 360 |
| `set emitter velocity to vx _ vy _` | A shortcut that sets speed and direction together. `vx` is how fast to go right (use a minus number for left). `vy` is how fast to go down (minus for up). | not used |
| `set emitter size to _` | How big each dot is. `1` is a single pixel, `3` is a 3 by 3 square. | 1 |
| `set emitter lifetime from _ to _ ms` | How long each dot lasts before it disappears. 1000 ms is one second. | 500 to 2000 |
| `set emitter color to _` | Makes every dot the same colour. | mixed colours |
| `set emitter colors to array of _` | Gives a list of colours. Each dot picks one at random. Click a slot to choose a colour, and press **+** to add more slots. | mixed colours |
| `set emitter gravity to x _ y _` | Pulls dots sideways (`x`) or down (`y`) so they curve. `y 100` makes them fall. A minus number makes them float up. | 0 and 0 (no pull) |
| `set emitter z to _` | Chooses the layer. Sprites are on layer 0. A higher number draws dots **in front** of sprites, a minus number draws them **behind**. | 50 (in front) |

**Direction guide**

| Number | Way |
| --- | --- |
| 0 | right |
| 90 | down |
| 180 | left |
| 270 | up |

Numbers in between give slanted directions. For example, 315 is up and to the right.

**Two things to know**

- The velocity block also sets the spread to 0, so all dots go exactly the same way. Put a
  spread block **after** it if you want a wider spray.
- In the colours list, slots start out see-through. See-through slots are skipped. If you
  leave them all see-through, the emitter keeps the colours it already had.

### Actions

| Block | What it does |
| --- | --- |
| `start emitter` | Starts the steady stream of dots. |
| `stop emitter` | Stops making new dots. Dots already on screen finish their lives. |
| `burst _ particles from emitter` | Shoots out a bunch of dots all at once. Great for explosions. It works even when the emitter is stopped. |
| `clear emitter` | Makes every dot on screen vanish straight away. |
| `destroy emitter` | Removes the emitter for good. Use this when you are completely finished with it. |

## Things to try

### Snow

One emitter at the top of the screen that jumps to a new spot many times a second.

```blocks
let snow = artParticles.createEmitter(80, 0, 100)
snow.setRate(20)
snow.setDirection(90)
snow.setSpread(20)
snow.setSpeed(20, 40)
snow.setLifetime(3000, 4000)
snow.setColor(1)
game.onUpdateInterval(50, function () {
    snow.setPosition(randint(0, 160), 0)
})
```

### Firework when you press A

The emitter is stopped, so it only fires when you ask for a burst.

```blocks
let boom = artParticles.createEmitter(80, 60, 100)
boom.stop()
boom.setSize(2)
boom.setLifetime(300, 800)
boom.setColors([2, 4, 5])
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    boom.setPosition(randint(20, 140), randint(20, 100))
    boom.burst(40)
})
```

### Comet trail

All dots fly the same way, with a little spread to make the tail fuzzy.

```blocks
let comet = artParticles.createEmitter(0, 30)
comet.setRate(40)
comet.setVelocity(80, 20)
comet.setSpread(10)
comet.setColors([5, 4])
```

## If something looks wrong

- **No dots at all?** Check the rate is more than 0, the emitter is not stopped, and its
  position is on the screen (x between 0 and 160, y between 0 and 120).
- **Dots stop appearing for a moment?** The emitter has hit its limit. Create it with more
  particles, lower the rate, or shorten the lifetime.
- **Dots hide behind a sprite, or cover it up?** Change the z setting.
- **Dots do not move with the camera?** That is how it works for now. Positions are places
  on the screen, not places in a scrolling level.

## Using JavaScript

Every block is also a function. Create an emitter with `artParticles.createEmitter(x, y)`
and call the functions shown in the examples above, such as `setRate`, `setSpeed`,
`setDirection`, `setSpread`, `setVelocity`, `setSize`, `setLifetime`, `setColor`,
`setColors`, `setGravity`, `setZ`, `setPosition`, `start`, `stop`, `burst`, `clear` and
`destroy`. Colours are the Arcade palette numbers 1 to 15.

## License

MIT

## Supported targets

* for PXT/arcade
