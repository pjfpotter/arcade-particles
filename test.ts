// Demo that exercises every setting and action; check it by eye in the simulator.
//   A: burst at a random spot    B: start/stop the fountain
//   up: clear the fountain       down: destroy the stream

// Fountain: direction, spread, speed, lifetime, gravity, colors, size, rate, pool size
let fountain = artParticles.createEmitter(80, 110, 150);
fountain.setRate(60);
fountain.setDirection(270);
fountain.setSpread(40);
fountain.setSpeed(70, 120);
fountain.setLifetime(900, 1600);
fountain.setGravity(0, 140);
fountain.setColors([9, 8, 6, 1]);
fountain.setSize(2);

// Stream: velocity, single color, z (behind the sprite)
let stream = artParticles.createEmitter(0, 20);
stream.setVelocity(60, 0);
stream.setSpread(15);
stream.setColor(5);
stream.setZ(-1);

let block = sprites.create(image.create(16, 16));
block.image.fill(2);
block.setPosition(80, 20);

// Burst: position, burst
let burst = artParticles.createEmitter(40, 60, 100);
burst.stop();
burst.setSize(3);
burst.setLifetime(300, 700);

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    burst.setPosition(artParticles.randomInt(20, 140), artParticles.randomInt(30, 90));
    burst.burst(30);
});

let running = true;
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    running = !running;
    if (running) {
        fountain.start();
    } else {
        fountain.stop();
    }
});

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    fountain.clear();
});

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    stream.destroy();
});
