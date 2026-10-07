# arcade-particles

A MakeCode Arcade (PXT) extension providing a particle emitter for digital art. Published from
https://github.com/pjfpotter/arcade-particles and consumed by importing that URL as an extension
in https://arcade.makecode.com.

## Language constraints

This is MakeCode **Static TypeScript**, not full TypeScript/Node. There is no `package.json`,
no npm dependencies and no module system: every file contributes to the global `artParticles`
namespace (not `particles`, which is Arcade's built-in particle system). Avoid `import`/`export`
at file level, `any`-heavy code, `Map`/`Set`, spread on objects, generators, async/await and
other unsupported features. APIs come from the Arcade
target (`game`, `screen`, `scene`, `sprites`, `control`, ...).

## Layout

- `pxt.json` - manifest. A source file is only compiled if it is listed in `files`
  (`testFiles` for tests). Compile order follows the list order.
- `main.ts` - toolbox category and the `createEmitter` block (`//%` annotations define
  blocks in the editor toolbox).
- `emitter.ts` - `ParticleEmitter`: fixed-size particle pool, emission, rendering, and the
  Settings/Actions blocks. One shared `game.onUpdate` handler drives all emitters, because
  those handlers cannot be unregistered; drawing happens in a `scene.createRenderable`,
  since pixels drawn during update are painted over by the background.
- `ArtParticle.ts` - a single particle.
- `utils.ts` - `lerp`, `randomRange`, `randomInt`.
- `test.ts` - visual demo of every setting and action. Only compiled when this repo is built
  as the top-level project, not when it is consumed as an extension.
- `SPEC.md` - scope and decisions for the current milestone.

## Build and test

There is no local toolchain checked in. Compile-check with the MakeCode CLI:

```
npx -y makecode build
```

This writes `built/` (and may write `mkc.json`) into the repo; they are not gitignored, so
do not commit them. `npx -y makecode serve` runs the simulator locally in a browser.

A successful build only proves the code compiles. Behaviour is visual, so verify it in the
simulator: either `makecode serve`, or in arcade.makecode.com via Extensions -> paste the
GitHub URL, then use the Particles blocks or `artParticles.createEmitter(80, 60)`.

`makecode build`/`serve` do not check block annotations. After changing any `//%` line,
load the extension in the arcade.makecode.com editor and confirm the blocks appear and
convert to and from JavaScript.

The simulator is throttled when its browser tab is not in the foreground, so timing looks
wrong in automated or background checks. Test states that persist rather than ones that
depend on waiting a fixed time.

## Releasing

Consumers pin to git tags. Bump `version` in `pxt.json` and push a matching `vX.Y.Z` tag,
otherwise the editor keeps serving the previous version.
