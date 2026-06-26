class BabylonRender extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initBabylonRenderComponent';

    TV_HTML = /*html*/`
        <div class="flex gap-8 items-center">
            <div style="width:300px; height: 300px; position:relative;">
                <img src="/src/3d/smartphone/preview.png" width="300" height="300" 
                    title="Smartphone preview"
                    x-show="!isAllScriptsFetched"
                    style="position: absolute; top:0; left:0; width: 300px; height: 300px;"
                />
                <canvas id="main-canvas" style="outline:none;"></canvas>
            </div>
            <canvas id="fetch-image" class="border-2 border-gray-600"
                style="width: 141px; height: 300px; border-radius: 10px; border: 2px solid #555; background-color:#000;"
                x-show="catchedTexture"></canvas>
        </div>
        <button @click="applySkin()">Apply</button>
        <input id="load-image" type="file" />
        <template x-if="catchedTexture">
            <div class="flex flex-col items-center">
                <input x-model:number="catchedTextureX" type="range"  min="-100" max="100" />
                <input x-model:number="catchedTextureY" type="range"  min="-100" max="100" />
                <input x-model:number="catchedTextureScale" type="range"  min="20" max="500" />
                <input x-model:number="catchedTextureRotate" type="range"  min="-180" max="180" />
            </div>
        </template>
    `

    initBabylonRenderComponent() {
        return {
            canvas: null,
            engine: null,
            scene: null,
            camera: null,
            mainMaterialLink: null,
            meshes: [],
            libs: [
                'src/lib/babylon.js',
                'src/lib/babylon_import.js'
            ],
            isAllScriptsFetched: false,
            imageAttachment: null,
            imageInput: null,
            imageInputCanvas: null,
            catchedTexture: null,
            catchedTextureX: 0,
            catchedTextureY: 0,
            catchedTextureScale: 100,
            catchedTextureRotate: 0,
            applyingDebounceMs: 1000,
            applyingTimeout: null,

            init() {
                this.canvas = this.$el.querySelector("#main-canvas");
                this.canvas.width = 300;
                this.canvas.height = 300;
                this.fetchScripts(this.startRender.bind(this));
                this.handleImageInput();
                ['catchedTextureX', 'catchedTextureY', 'catchedTextureScale', 'catchedTextureRotate']
                .forEach(variable => {
                    this.$watch(variable, this.handleImageInputImagePosition.bind(this));
                });
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
                    if (document.head.querySelector('script[src="' + this.libs[idx] + '"]')) {
                        handleLoad.call(this);
                        return;
                    }
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
                this.camera = camera;
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
                .ImportMeshAsync('', './src/3d/', 'smartphone_two_textured.glb')
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
                this.meshes.forEach((mesh, idx) => {
                    if (idx !== 0) return;
                    const newTexture = new BABYLON.Texture("./src/3d/smartphone/skin_naruto.jpg", mesh.getScene());
                    if (mesh.material instanceof BABYLON.PBRMaterial) {
                        mesh.material.albedoTexture = newTexture;
                    } else if (mesh.material instanceof BABYLON.StandardMaterial) {
                        mesh.material.diffuseTexture = newTexture;
                    }
                });
            },

            getResultByPercentage(percentage, totalNumber) {
                return Math.floor((percentage / 100) * totalNumber);
            },

            handleImageInputImagePosition() {
                this.loadInputImage(null, true);
            },

            handleImageInput() {
                this.imageInput = this.$el.querySelector("#load-image");
                this.imageInputCanvas = this.$el.querySelector("#fetch-image"); 
                this.imageInputCanvas.width = 512;
                this.imageInputCanvas.height = 1087;
                this.imageInput.addEventListener('change', this.loadInputImage.bind(this));
            },

            loadInputImage(e, isWatched) {
                const file = e ? e.target.files[e.target.files.length - 1] : this.imageAttachment;
                if (!file) return;
                this.imageAttachment = file;

                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    const ctx = this.imageInputCanvas.getContext("2d");
                    const img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, this.imageInputCanvas.width, this.imageInputCanvas.height);
                        const scaleFactor = this.catchedTextureScale / 100;
                        const canvasWidth = this.imageInputCanvas.width;
                        const canvasHeight = this.imageInputCanvas.height;
                        const proportion = img.width / img.height;
                        let imgWidth = img.width;
                        let imgHeight = img.height;
                        imgHeight = canvasHeight * scaleFactor;
                        imgWidth = Math.floor(imgHeight * proportion);

                        const shiftX = this.getResultByPercentage(this.catchedTextureX, imgWidth);
                        const shiftY = this.getResultByPercentage(this.catchedTextureY, imgHeight);
                        ctx.save();
                        ctx.rotate(this.catchedTextureRotate * Math.PI / 180);
                        ctx.drawImage(img, shiftX, shiftY, imgWidth, imgHeight);
                        ctx.restore();
                        if (isWatched) {
                            if (this.applyingTimeout) return;
                            this.applyingTimeout = setTimeout(() => {
                                this.handleInputImageTexture(isWatched);
                                this.applyingTimeout = null;
                            }, this.applyingDebounceMs);
                        } else {
                            this.handleInputImageTexture();
                        }
                    };
                    img.src = base64;
                };
                reader.readAsDataURL(file);
            },
            
            handleInputImageTexture(isWatched) {
                if (!this.mainMaterialLink || !this.meshes.length || (isWatched && !this.catchedTexture)) return;
                
                const dataURL = this.imageInputCanvas.toDataURL('image/png');
                if (isWatched) {
                    this.catchedTexture.updateURL(dataURL);
                    return;
                }

                const textureId = "extCanvasTex_" + Date.now();
                this.catchedTexture = BABYLON.Texture.CreateFromBase64String(dataURL, textureId, this.scene, true, false);
                /*
                this.catchedTexture.uOffset = this.catchedTextureX / 100; 
                this.catchedTexture.vOffset = this.catchedTextureY / 100;
                this.catchedTexture.uScale = this.catchedTextureScaleX / 100;
                this.catchedTexture.vScale = this.catchedTextureScaleY / 100;;
                this.catchedTexture.wAng = this.catchedTextureRotate * (Math.PI / 180);
                */
                // Disable tiles
                this.catchedTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                this.catchedTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

                this.meshes.forEach((mesh, idx) => {
                    if (idx !== 0) return;
                    const mat = mesh.material;
                    if (mat && mat.getClassName && mat.getClassName() === "PBRMetallicRoughnessMaterial") {
                        mat.baseTexture = this.catchedTexture;
                    } else if (mat instanceof BABYLON.PBRMaterial) {
                        mat.albedoTexture = this.catchedTexture;
                    } else if (mat instanceof BABYLON.StandardMaterial) {
                        mat.diffuseTexture = this.catchedTexture;
                    }
                });

                if (!isWatched) {
                    this.rotateCameraTo(210);
                }
            },

            rotateCameraTo(targetAlphaDegrees) {
                const targetAlpha = targetAlphaDegrees * (Math.PI / 180);
                let observer = null;
                const stopAnimationOnInteraction = () => {
                    if (observer) {
                        this.scene.onBeforeRenderObservable.remove(observer);
                        observer = null;
                    }
                    this.canvas.removeEventListener("pointerdown", stopAnimationOnInteraction);
                    this.canvas.removeEventListener("wheel", stopAnimationOnInteraction);
                };
                this.canvas.addEventListener("pointerdown", stopAnimationOnInteraction);
                this.canvas.addEventListener("wheel", stopAnimationOnInteraction);
                observer = this.scene.onBeforeRenderObservable.add(() => {
                    this.camera.alpha = BABYLON.Scalar.Lerp(this.camera.alpha, targetAlpha, 0.05);
                    if (Math.abs(this.camera.alpha - targetAlpha) < 0.001) {
                        this.camera.alpha = targetAlpha;
                        stopAnimationOnInteraction(); 
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
