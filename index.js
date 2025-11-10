const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Проверка мобильного устройства
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Камера
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    if (!isMobile) {
        // ПК: мышь + WASD
        camera.attachControl(canvas, true);
        camera.keysUp.push(87);    // W
        camera.keysDown.push(83);  // S
        camera.keysLeft.push(65);  // A
        camera.keysRight.push(68); // D
    } else {
        // Мобила: свайпы для поворота
        camera.attachControl(canvas, true);

        // Джойстик слева для движения
        const leftJoystick = new BABYLON.VirtualJoystick(true);
        leftJoystick.setJoystickSensibility(0.15); // чувствительность
        camera.inputs.addVirtualJoystick(leftJoystick);
    }

    // Свет
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Куб
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
