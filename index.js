const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const fpsCounter = document.getElementById("fpsCounter");

// Сцена и физика
const scene = new BABYLON.Scene(engine);
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

// Свет
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Земля
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
ground.position.y = 0;
ground.checkCollisions = true;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.1}, scene
);

// Герой
const hero = BABYLON.MeshBuilder.CreateCylinder("hero", {diameter: 1, height: 2}, scene);
hero.position.y = 1;
hero.isVisible = false;
hero.checkCollisions = true;
hero.physicsImpostor = new BABYLON.PhysicsImpostor(
    hero, BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 1, restitution: 0}, scene
);

// Камера привязана к герою
const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.5, -5), scene);
camera.parent = hero;
camera.attachControl(canvas, true);

// Управление
const inputMap = {};
scene.actionManager = new BABYLON.ActionManager(scene);
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
        inputMap[evt.sourceEvent.key.toLowerCase()] = true;
    })
);
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
        inputMap[evt.sourceEvent.key.toLowerCase()] = false;
    })
);

const speed = 0.1;
const jumpForce = 5;

// Мобильный джойстик
let leftJoystick = null;
if (isMobile) {
    leftJoystick = new BABYLON.VirtualJoystick(true);
    camera.inputs.addVirtualJoystick(leftJoystick);

    // Кнопка прыжка
    const jumpBtn = document.createElement("button");
    jumpBtn.textContent = "Jump";
    jumpBtn.style.position = "absolute";
    jumpBtn.style.right = "20px";
    jumpBtn.style.bottom = "50px";
    jumpBtn.style.padding = "20px";
    jumpBtn.style.fontSize = "16px";
    document.body.appendChild(jumpBtn);
    jumpBtn.addEventListener("touchstart", () => {
        hero.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, jumpForce, 0), hero.getAbsolutePosition());
    });
}

// Главный цикл движения
scene.onBeforeRenderObservable.add(() => {
    const forward = new BABYLON.Vector3(Math.sin(camera.rotation.y), 0, Math.cos(camera.rotation.y));
    const right = new BABYLON.Vector3(Math.cos(camera.rotation.y), 0, -Math.sin(camera.rotation.y));
    let move = new BABYLON.Vector3.Zero();

    if (!isMobile) {
        if (inputMap["w"]) move.addInPlace(forward.scale(speed));
        if (inputMap["s"]) move.addInPlace(forward.scale(-speed));
        if (inputMap["a"]) move.addInPlace(right.scale(-speed));
        if (inputMap["d"]) move.addInPlace(right.scale(speed));
        if (inputMap[" "]) hero.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, jumpForce, 0), hero.getAbsolutePosition());
    } else if (leftJoystick) {
        const delta = new BABYLON.Vector3(leftJoystick.deltaPosition.x, 0, leftJoystick.deltaPosition.y);
        move.addInPlace(forward.scale(-delta.z * speed));
        move.addInPlace(right.scale(delta.x * speed));
    }

    hero.moveWithCollisions(move);

    // Обновление FPS
    fpsCounter.textContent = "FPS: " + Math.round(engine.getFps());
});

// Безлимитный FPS
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
