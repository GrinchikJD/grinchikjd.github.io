class ThreeRender extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initThreeRenderComponent';

    TV_HTML = /*html*/`
        <div class="flex gap-8 items-center justify-center">
            <div :style="{ width: babylonConfig.w + 'px', height: babylonConfig.h + 'px'}"
                style="position: relative;"
                :class="{ 
                    'animate-pulse rounded-md' : !isAllScriptsFetched, 
                    'cursor-grab': (isAllScriptsFetched && !isGrabbing),
                    'cursor-grabbing': (isAllScriptsFetched && isGrabbing)
                }"
                class="flex items-center justify-center"
            >
                <img src="/src/svg/blocks-wave.svg" alt="Loading..." width="32" height="32" 
                    class="svg-icon absolute z-10 pointer-events-none"
                    x-show="!isAllScriptsFetched" fetchpriority="high" loading="eager"
                />
                <img src="/src/3d/smartphone/preview.webp" 
                    :width="babylonConfig.w" :height="babylonConfig.h" 
                    title="Smartphone preview"
                    alt="Smartphone preview"
                    x-show="!isAllScriptsFetched"
                    style="position: absolute; top:0; left:0;"
                    :style="{ width: babylonConfig.w + 'px', height: babylonConfig.h + 'px'}"
                    class="pointer-events-none"
                />
                <canvas id="main-canvas" style="outline:none;"></canvas>
            </div>
            <div class="flex items-center justify-end relative cursor-move"
                x-show="catchedTexture"
            >
                <div class="phone-blueprint-preview border-2 border-gray-600
                        overflow-hidden flex items-center justify-center"
                    style="width: 141px; height: 300px; border-radius: 10px; background-color:#000;"
                >
                    <canvas id="fetch-image" style="width: 141px; height: 300px;"></canvas>
                </div>
                <input x-model:number="catchedTextureX" type="range"  min="-100" max="100" 
                    class="absolute w-full -bottom-1 z-10"
                />
                <input x-model:number="catchedTextureY" type="range"  min="-100" max="100" 
                    class="absolute !w-[300px] z-10 rotate-90 translate-x-[153px]"
                />
            </div>
        </div>
        <button @click="applySkin()">Apply</button>
        <input id="load-image" type="file" />
        <template x-if="catchedTexture">
            <div class="flex flex-col items-center">
                <input x-model:number="catchedTextureScale" type="range"  min="20" max="500" />
                <input x-model:number="catchedTextureRotate" type="range"  min="-180" max="180" />
            </div>
        </template>
    `

    initThreeRenderComponent() {
        let _renderer = null;
        let _scene = null;
        let _camera = null;
        let _controls = null;
        let _meshes = [];
        let _mainMaterialLink = null;

        return {
            canvas: null,
            animationFrameId: null,
            babylonConfig: { w: 300, h: 300 },
            isGrabbing: false,
            libs: [
                'src/lib/three.js',
                'src/lib/GLTFLoader.js',
                'src/lib/OrbitControls.js'
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
            targetAlpha: null,
            isAnimatingCamera: false,

            init() {
                this.canvas = this.$el.querySelector("#main-canvas");
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
                    if (numberToFetch === fetched) { callback(); return; }
                    addScriptByIndex(fetched);
                }
                const addScriptByIndex = (idx) => {
                    if (document.head.querySelector('script[src="' + this.libs[idx] + '"]')) {
                        handleLoad.call(this); return;
                    }
                    let newScript = document.createElement('script');
                    newScript.src = this.libs[idx];
                    newScript.onload = handleLoad.bind(this);
                    document.head.appendChild(newScript);
                }
                addScriptByIndex(fetched);
            },

            startRender() {
                _renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
                _renderer.setSize(this.babylonConfig.w, this.babylonConfig.h);
                _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                
                _scene = new THREE.Scene();
                
                _camera = new THREE.PerspectiveCamera(45, this.babylonConfig.w / this.babylonConfig.h, 0.1, 100);
                _camera.position.set(2.9, 3.2, 2.9);

                _controls = new THREE.OrbitControls(_camera, this.canvas);
                _controls.enableDamping = true;
                _controls.dampingFactor = 0.05;
                _controls.minDistance = 3;
                _controls.maxDistance = 6;

                this.canvas.addEventListener('mousedown', () => { this.isGrabbing = true; });
                window.addEventListener('mouseup', () => { this.isGrabbing = false; });

                const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0);
                hemiLight.position.set(0, 0, 0);
                _scene.add(hemiLight);

                const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
                dirLight.position.set(-10, 0, -10);
                _scene.add(dirLight);

                this.createModel();

                const tick = () => {
                    if (this.isAnimatingCamera && this.targetAlpha !== null) {
                        let currentAlpha = Math.atan2(_camera.position.z, _camera.position.x);
                        currentAlpha = THREE.MathUtils.lerp(currentAlpha, this.targetAlpha, 0.05);
                        
                        const radius = new THREE.Vector3(_camera.position.x, 0, _camera.position.z).length();
                        _camera.position.x = radius * Math.cos(currentAlpha);
                        _camera.position.z = radius * Math.sin(currentAlpha);

                        if (Math.abs(currentAlpha - this.targetAlpha) < 0.001) {
                            this.isAnimatingCamera = false;
                        }
                    }

                    _controls.update();
                    _renderer.render(_scene, _camera);
                    this.animationFrameId = requestAnimationFrame(tick);
                };
                tick();
            },

            createModel() {
                const loader = new THREE.GLTFLoader();
                loader.load('./src/3d/smartphone_two_textured.glb', 
                    (gltf) => {
                        gltf.scene.traverse((child) => {
                            if (child.isMesh) {
                                child.scale.set(0.9, 0.9, 0.9);
                                if (child.material) {
                                    _mainMaterialLink = child.material;
                                    _meshes.push(child);
                                }
                            }
                        });
                        _scene.add(gltf.scene);
                        this.isAllScriptsFetched = true;
                        console.log('The entire model has been loaded');
                    },
                    undefined,
                    (error) => { console.error('An error happened while loading GLTF', error); }
                );
            },

            applySkin() {
                if (!_mainMaterialLink || !_meshes.length) return;
                
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load("./src/3d/smartphone/skin_naruto.jpg", (texture) => {
                    _meshes.forEach((mesh, idx) => {
                        if (idx !== 0) return;
                        mesh.material.map = texture;
                        mesh.material.needsUpdate = true;
                    });
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
                        const canvasHeight = this.imageInputCanvas.height;
                        const proportion = img.width / img.height;
                        
                        let imgHeight = canvasHeight * scaleFactor;
                        let imgWidth = Math.floor(imgHeight * proportion);

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
                if (!_mainMaterialLink || !_meshes.length || (isWatched && !this.catchedTexture)) return;
                
                const dataURL = this.imageInputCanvas.toDataURL('image/png');
                
                if (isWatched && this.catchedTexture) {
                    const img = new Image();
                    img.onload = () => {
                        this.catchedTexture.image = img;
                        this.catchedTexture.needsUpdate = true;
                    };
                    img.src = dataURL;
                    return;
                }

                const img = new Image();
                img.onload = () => {
                    this.catchedTexture = new THREE.Texture(img);
                    this.catchedTexture.wrapS = THREE.ClampToEdgeWrapping;
                    this.catchedTexture.wrapT = THREE.ClampToEdgeWrapping;
                    this.catchedTexture.needsUpdate = true;

                    _meshes.forEach((mesh, idx) => {
                        if (idx !== 0) return;
                        mesh.material.map = this.catchedTexture;
                        mesh.material.needsUpdate = true;
                    });

                    if (!isWatched) {
                        this.rotateCameraTo(210);
                    }
                };
                img.src = dataURL;
            },

            rotateCameraTo(targetAlphaDegrees) {
                this.targetAlpha = targetAlphaDegrees * (Math.PI / 180);
                this.isAnimatingCamera = true;
                
                const stopAnimationOnInteraction = () => {
                    this.isAnimatingCamera = false;
                    this.canvas.removeEventListener("pointerdown", stopAnimationOnInteraction);
                    this.canvas.removeEventListener("wheel", stopAnimationOnInteraction);
                };
                this.canvas.addEventListener("pointerdown", stopAnimationOnInteraction);
                this.canvas.addEventListener("wheel", stopAnimationOnInteraction);
            }
        }
    }

    connectedCallback() {
         super.connectedCallback();
    }
}
$tv.setComponent(ThreeRender);