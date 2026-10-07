# arcade-particles

A MakeCode Arcade (PXT) extension providing a particle emitter for digital art. Published from
https://github.com/pjfpotter/arcade-particles and consumed by importing that URL as an extension
in https://arcade.makecode.com.

## Language constraints

This is MakeCode **Static TypeScript**, not full TypeScript/Node. There is no `package.json`,
no npm dependencies and no module system: every file contributes to the global `particles`
namespace. Avoid `import`/`export` at file level, `any`-heavy code, `Map`/`Set`, spread on
objects, generators, async/await and other unsupported features. APIs come from the Arcade
target (`game`, `screen`, `scene`, `sprites`, `control`, ...).

## Layout

- `pxt.json` - manifest. A source file is only compiled if it is listed in `files`
  (`testFiles` for tests). Compile order follows the list order.
- `main.ts` - block-facing API (`//%` annotations define the blocks in the editor toolbox).
- `emitter.ts` - `ParticleEmitter`: fixed-size particle pool, emission timing, rendering.
- `ArtParticle.ts` - a single particle. Named `ArtParticle` because Arcade already has a
  built-in `particles.Particle`; the namespace `particles` is also shared with Arcade's
  built-in particle system, so check for name clashes before adding exports.
- `utils.ts` - `lerp`, `randomRange`, `randomInt`.
- `test.ts` - only compiled when this repo is built as the top-level project, not when it is
  consumed as an extension.

## Build and test

There is no local toolchain checked in. Compile-check with the MakeCode CLI:

```
npx -y makecode build
```

This writes `built/` (and may write `mkc.json`) into the repo; they are not gitignored, so
do not commit them. `npx -y makecode serve` runs the simulator locally in a browser.

A successful build only proves the code compiles. Behaviour is visual, so verify it in the
simulator: either `makecode serve`, or in arcade.makecode.com via Extensions -> paste the
GitHub URL, then use the Particles blocks or `particles.createEmitter(80, 60)`.

## Releasing

Consumers pin to git tags. Bump `version` in `pxt.json` and push a matching `vX.Y.Z` tag,
otherwise the editor keeps serving the previous version.
