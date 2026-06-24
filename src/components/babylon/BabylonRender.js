class BabylonRender extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initBabylonRenderComponent';

    TV_HTML = /*html*/`
        <!--
        <img src="/src/3d/smartphone/preview.png" width="300" height="300" 
            title="Smartphone preview"
            x-show="!isAllScriptsFetched"
        />
        -->
        <div class="flex gap-8 items-center">
            <canvas id="main-canvas" style="outline:none;"></canvas>
            <canvas id="fetch-image" style="position: fixed; width: 0; height:0;"></canvas>
        </div>
        <button @click="applySkin()">Apply</button>
        <input id="load-image" type="file" />
        
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
            imageInput: null,
            imageInputCanvas: null,

            init() {
                this.canvas = this.$el.querySelector("#main-canvas");
                this.canvas.width = 300;
                this.canvas.height = 300;
                this.fetchScripts(this.startRender.bind(this));
                this.handleImageInput();
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
            },

            handleImageInput() {
                this.imageInput = this.$el.querySelector("#load-image");
                this.imageInputCanvas = this.$el.querySelector("#fetch-image"); 
                this.imageInputCanvas.width = 512;
                this.imageInputCanvas.height = 512;
                this.imageInput.addEventListener('change', this.loadInputImage.bind(this));
            },

            loadInputImage(e) {
                const file = e.target.files[e.target.files.length - 1];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    const ctx = this.imageInputCanvas.getContext("2d");
                    const img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, this.imageInputCanvas.width, this.imageInputCanvas.height);
                        ctx.drawImage(img, 0, 0, this.imageInputCanvas.width, this.imageInputCanvas.height);
                        this.handleInputImageTexture();
                    };
                    img.src = base64;
                };
                reader.readAsDataURL(file);
            },
            
            handleInputImageTexture() {
                if (!this.mainMaterialLink || !this.meshes.length) return;
                
                const dataURL = this.imageInputCanvas.toDataURL('image/png');
                const textureId = "extCanvasTex_" + Date.now();
                const tex = BABYLON.Texture.CreateFromBase64String(dataURL, textureId, this.scene, true, false);
                this.meshes.forEach((mesh, idx) => {
                    if (idx !== 0) return;
                    const mat = mesh.material;
                    if (mat && mat.getClassName && mat.getClassName() === "PBRMetallicRoughnessMaterial") {
                        mat.baseTexture = tex;
                    } else if (mat instanceof BABYLON.PBRMaterial) {
                        mat.albedoTexture = tex;
                    } else if (mat instanceof BABYLON.StandardMaterial) {
                        mat.diffuseTexture = tex;
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
