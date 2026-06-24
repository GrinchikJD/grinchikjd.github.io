class BabylonRender extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initBabylonRenderComponent';

    TV_HTML = /*html*/`
        <canvas id="mainCanvas" style="outline:none;"></canvas>
        <button @click="applySkin()">Apply skin</button>
    `

    initBabylonRenderComponent() {
        return {
            canvas: null,
            engine: null,
            scene: null,
            mainMaterialLink: null,
            meshes: [],
            libs: [
                'src/lib/babylon.js',
                'src/lib/babylon_import.js'
            ],
            isAllScriptsFetched: false,

            init() {
                this.canvas = this.$el.querySelector("#mainCanvas");
                this.canvas.width = 300;
                this.canvas.height = 300;
                this.fetchScripts(this.startRender.bind(this));
            },

            fetchScripts(callback) {
                const numberToFetch = this.libs.length;
                let fetched = 0;
                const handleLoad = () => {
                    fetched++;
                    if (numberToFetch === fetched) {
                        callback(); return;
                    };
                    addScriptByIndex(fetched);
                }
                const addScriptByIndex = (idx) => {
                    let newScript = document.createElement('script');
                    newScript.src = this.libs[idx];
                    newScript.onload = handleLoad.bind(this);
                    document.head.appendChild(newScript);
                }
                addScriptByIndex(fetched);
            },

            startRender() {
                this.engine = new BABYLON.Engine(this.canvas, true, {stencil:true});
                this.scene = this.createScene();
                this.scene.createDefaultEnvironment({
                    createGround: false,
                    enableGroundShadow: false,
                    createSkybox: false,
                    groundYBias: 1,
                    groundOpacity: 0,
                });
                this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });
            },

            createScene() {
                var scene = new BABYLON.Scene(this.engine);
                scene.useRightHandedSystem = true;

                const camera = new BABYLON.ArcRotateCamera(
                    "camera", -Math.PI / 5, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0), scene
                );
                camera.attachControl(this.canvas, true);
                camera.wheelPrecision = 100;
                camera.lowerRadiusLimit = 3;
                camera.upperRadiusLimit = 6;

                const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-1.1, 0.5, 0.6), scene);
                light.position = new BABYLON.Vector3(0, 1, 0);
                light.intensity = 2;
                light.diffuse = new BABYLON.Color3(1, 1, 1);
                light.specular = new BABYLON.Color3(1, 1, 1);

                this.createModel();

                return scene;
            },

            createModel() {
                BABYLON.SceneLoader
                .ImportMeshAsync('', './src/3d/', 'smartphone.glb')
                .then((result) => {
                    result.meshes.forEach( (mesh, idx) => {
                        mesh.scaling = new BABYLON.Vector3(0.9, 0.9, 0.9);
                        if (mesh.material) {
                            this.mainMaterialLink = mesh.material;
                            this.meshes.push(mesh);
                        }
                    });    
                })
                .then(() => {
                    this.isAllScriptsFetched = true;
                    console.log('The entire model has been loaded');
                });
            },

            applySkin() {
                if (!this.mainMaterialLink || !this.meshes.length) return;
                this.meshes.forEach(mesh => {
                    const newTexture = new BABYLON.Texture(
                        "./src/3d/smartphone/skin_naruto.jpg",
                        mesh.getScene()
                    );
                    if (mesh.material instanceof BABYLON.PBRMaterial) {
                        mesh.material.albedoTexture = newTexture;
                    } else if (mesh.material instanceof BABYLON.StandardMaterial) {
                        mesh.material.diffuseTexture = newTexture;
                    }
                });
            }
        }
    }

    connectedCallback() {
         super.connectedCallback();
    }
}
$tv.setComponent(BabylonRender);
