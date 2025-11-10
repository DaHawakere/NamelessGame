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
        camera.attachControl(canvas, true); // ПК: мышь и WASD
    } else {
        camera.attachControl(canvas, true); // Мобила: свайпы сами крутят камеру

        // Виртуальный джойстик слева для движения
        const joystick = new BABYLON.VirtualJoystick(true);
        joystick.setJoystickSensibility(0.15); // чувствительность
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
