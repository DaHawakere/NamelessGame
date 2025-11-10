const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Камера
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // Свет
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Куб
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => scene.render());

window.addEventListener("resize", () => engine.resize());
