/* Galaxy visuals adapted from the public browser source at
 * https://love-galaxy-pro.netlify.app/ (author credit: Luc Thien Phong).
 * Local integration: heart-triggered cinematic intro, no letter/help, local photo viewer.
 * Three.js license is preserved in vendor/LICENSE.
 */

        import { createGalaxyCinematic } from "/galaxy/cinematic.js";
        import * as THREE from "/galaxy/vendor/three.module.js";
        import { OrbitControls } from "/galaxy/vendor/examples/jsm/controls/OrbitControls.js";
        import { EffectComposer } from "/galaxy/vendor/examples/jsm/postprocessing/EffectComposer.js";
        import { RenderPass } from "/galaxy/vendor/examples/jsm/postprocessing/RenderPass.js";
        import { AfterimagePass } from "/galaxy/vendor/examples/jsm/postprocessing/AfterimagePass.js";

        // Chờ config từ pre-script (nếu có ?id= thì đợi API trả về, ngược lại resolve null ngay)
        const gift = window.parent.GIFT_CONFIG || {};
        const configuredPhotos = gift.galaxy?.photos || gift.chapters?.flatMap(chapter => chapter.photos) || [];
        const galleryPhotos = configuredPhotos.length ? configuredPhotos.map(photo => typeof photo === 'string' ? {src: photo} : photo) : Array.from({length: 12}, (_, i) => ({src: `/gift/photos/p${String(i + 1).padStart(2, '0')}.jpg`}));
        const __APP_CONFIG__ = {
            title: gift.galaxy?.title || 'Gửi Em 💘',
            messages: gift.galaxy?.messages,
            images: galleryPhotos.map(photo => photo.src),
        };
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let scene = new THREE.Scene();
        // scene.background = null → canvas trong suốt, hiện gradient CSS phía sau
        let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
        // Start inside the photo annulus, just above the image plane.
        const defaultCameraPosition = new THREE.Vector3(0, 3, innerWidth < 768 ? 39 : 34);
        const defaultCameraTarget = new THREE.Vector3(0, 6, 0);
        camera.position.copy(defaultCameraPosition);
        camera.lookAt(defaultCameraTarget);
        let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        // QUAN TRỌNG: render ở DPR thật của thiết bị → hạt sao sắc nét trên mobile
        // Mobile cap 1.5 (DPR=3 trên S22+/S23 → 4× fragment, mid-range Mali tụt fps);
        // hạt có glow nên 1.5 nhìn vẫn mượt. Desktop cap 2 cho màn retina.
        const IS_MOBILE = innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
        const PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2);
        renderer.setPixelRatio(PIXEL_RATIO);
        renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(renderer.domElement);

        // === Shooting Stars (CSS DOM, bê từ trai_tim-tiktok_mua/index.main.js:177-211) ===
        const shootingStarsContainer = document.createElement('div');
        shootingStarsContainer.className = 'shooting-stars';
        shootingStarsContainer.id = 'shooting-stars';
        document.body.appendChild(shootingStarsContainer);
        (function createShootingStars() {
            const numShootingStars = reducedMotion ? 0 : 20;
            for (let i = 0; i < numShootingStars; i++) {
                const shootingStar = document.createElement('div');
                shootingStar.className = 'shooting-star';
                // Vị trí bắt đầu: nửa phải + 1/3 trên của màn hình
                const startX = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.2);
                const startY = Math.random() * (window.innerHeight * 0.3);
                shootingStar.style.left = startX + 'px';
                shootingStar.style.top  = startY + 'px';
                shootingStar.style.animationDelay = (Math.random() * 10) + 's';
                const size = 6 + Math.random() * 6;  // 6-12px (gấp đôi gốc)
                shootingStar.style.width  = size + 'px';
                shootingStar.style.height = size + 'px';
                shootingStarsContainer.appendChild(shootingStar);
            }
        })();
        window.addEventListener("resize", event => {
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(PIXEL_RATIO);
            renderer.setSize(innerWidth, innerHeight);
            if (composer) {
                composer.setPixelRatio(PIXEL_RATIO);
                composer.setSize(innerWidth, innerHeight);
            }
        })
        let controls = new OrbitControls(camera, renderer.domElement);
        // Apply each drag immediately; releasing the pointer stops the camera.
        controls.enableDamping = false;
        controls.enableRotate = true;
        controls.rotateSpeed = 1;
        controls.enablePan = false;
        controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
        controls.mouseButtons.RIGHT = null;
        controls.minDistance = 8;
        controls.maxDistance = 200;
        controls.target.copy(defaultCameraTarget);
        controls.update();
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };

        const keys = {};
        window.addEventListener('keydown', e => {
            if (document.querySelector('dialog[open]')) return;
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
            keys[e.key] = true;
        });
        window.addEventListener('keyup', e => { keys[e.key] = false; });

        let gu = {
            time: { value: 0 }
        }
        let sizes = [];
        let shift = [];
        let partType = [];   // 0 = cầu (đỏ hồng), 1 = đĩa (đỏ đậm maroon), 2 = ring (đỏ tươi)
        let pushShift = () => {
            shift.push(
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2,
                (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
                Math.random() * 0.9 + 0.1
            );
        }
        let pts = new Array(IS_MOBILE ? 26000 : 50000).fill().map(p => {
            sizes.push(Math.random() * 1.5 + 0.5);
            pushShift();
            partType.push(0);
            return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
        })
        for (let i = 0; i < (IS_MOBILE ? 55000 : 100000); i++) {
            let r = 10, R = 85;
            let rand = Math.pow(Math.random(), 1.5);
            let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
            pts.push(new THREE.Vector3().setFromCylindricalCoords(radius, Math.random() * 2 * Math.PI, (Math.random() - 0.5) * 2));
            sizes.push(Math.random() * 1.5 + 0.5);
            pushShift();
            partType.push(1);
        }

        let g = new THREE.BufferGeometry().setFromPoints(pts);
        g.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
        g.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
        g.setAttribute("partType", new THREE.Float32BufferAttribute(partType, 1));
        let m = new THREE.PointsMaterial({
            size: 0.12,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            onBeforeCompile: shader => {
                shader.uniforms.time = gu.time;
                shader.vertexShader = `
                    uniform float time;
                    attribute float sizes;
                    attribute vec4 shift;
                    attribute float partType;
                    varying vec3 vColor;
                    ${shader.vertexShader}
                `.replace(
                    `gl_PointSize = size;`,
                    `gl_PointSize = size * sizes;`
                ).replace(
                    `#include <color_vertex>`,
                    `#include <color_vertex>
                    if (partType > 1.5) {
                        vColor = vec3(220., 40., 55.) / 255.;   // ring: đỏ tươi
                    } else if (partType > 0.5) {
                        vColor = vec3(140., 25., 40.) / 255.;   // đĩa xoáy galaxy: đỏ đậm (maroon)
                    } else {
                        vColor = vec3(255., 90., 90.) / 255.;   // cầu: đỏ hồng sáng
                    }
                `).replace(
                        `#include <begin_vertex>`,
                        `#include <begin_vertex>
                    float t = time;
                    float moveT = mod(shift.x + shift.z * t, PI2);
                    float moveS = mod(shift.y + shift.z * t, PI2);
                    transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.a;
                `);
                // console.log(shader.vertexShader);
                shader.fragmentShader = `
                varying vec3 vColor;
                ${shader.fragmentShader}
                `.replace(
                    `#include <clipping_planes_fragment>`,
                    `#include <clipping_planes_fragment>
                    float d = length(gl_PointCoord.xy - 0.5);
                    if (d > 0.5) discard;
                `).replace(
                        `vec4 diffuseColor = vec4( diffuse, opacity );`,
                        `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d) );`
                    );
                // console.log(shader.fragmentShader);
            }
        });
        let p = new THREE.Points(g, m);
        p.rotation.order = "ZYX";
        scene.add(p)

        // === Bầu trời sao nền (kiểu galaxy_yeuthuong: 20K sao rải khắp khối 900³) ===
        const STAR_COUNT = IS_MOBILE ? 9000 : 20000;
        const starPositions = new Float32Array(STAR_COUNT * 3);
        for (let i = 0; i < STAR_COUNT; i++) {
            starPositions[i * 3]     = (Math.random() - 0.5) * 900;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 900;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 900;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xff5a5a,      // đỏ hồng giống hạt lõi cầu rgb(255,90,90)
            size: 0.7,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
        });
        const stars = new THREE.Points(starGeo, starMat);
        stars.name = 'starfield';
        stars.renderOrder = 999;
        scene.add(stars);

        // =================================================================
        // === Trái tim hạt (bê nguyên từ trai_tim-tiktok_mua/assets) ===
        // =================================================================

        // --- makeMat: bê từ mins.js ---
        function makeMat({
            map = null,
            color = 0xffffff,
            transparent = true,
            vertexColors = true,
            sizeAttenuation = true,
            alphaSupport = false,
            clipBandWidth = 0,
            vClipSlope = 0,
            clipFrontZ = 0.1,
            blending = THREE.NormalBlending,
            opacity = 1,
            depthWrite = true,
        } = {}) {
            const material = new THREE.PointsMaterial({
                map, color, transparent, vertexColors, sizeAttenuation,
                blending, opacity, depthWrite,
            });
            material.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    "uniform float size;",
                    "attribute float size;" +
                    (alphaSupport ? "\nattribute float alpha;\nvarying float vAlpha;" : "") +
                    (clipBandWidth > 0 || vClipSlope > 0 ? "\nvarying vec3 vViewPos;" : "")
                );
                let vertexShaderAddition = "";
                if (clipBandWidth > 0 || vClipSlope > 0) vertexShaderAddition += "  vViewPos = mvPosition.xyz;\n";
                if (alphaSupport) vertexShaderAddition += "  vAlpha = alpha;\n";
                if (vertexShaderAddition) {
                    shader.vertexShader = shader.vertexShader.replace(
                        "#include <project_vertex>",
                        "#include <project_vertex>\n" + vertexShaderAddition
                    );
                }
                if (alphaSupport) {
                    shader.fragmentShader = shader.fragmentShader
                        .replace("void main() {", "varying float vAlpha;\nvoid main() {")
                        .replace(
                            "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
                            "gl_FragColor = vec4( outgoingLight, diffuseColor.a * vAlpha );"
                        );
                }
                if (clipBandWidth > 0 || vClipSlope > 0) {
                    shader.fragmentShader = shader.fragmentShader.replace(
                        "void main() {",
                        "varying vec3 vViewPos;\nvoid main() {"
                    );
                    let clippingCode = "";
                    if (clipBandWidth > 0) {
                        clippingCode += "\n  if (vViewPos.z < -" + clipBandWidth.toFixed(3) +
                            " && abs(vViewPos.x) < " + clipFrontZ.toFixed(3) + ") discard;";
                    }
                    if (vClipSlope > 0) {
                        clippingCode += "if (abs(vViewPos.x) < " + clipFrontZ.toFixed(3) +
                            " && vViewPos.z < -" + vClipSlope.toFixed(3) + " * (-vViewPos.z)) discard;";
                    }
                    const insertionPoint = alphaSupport
                        ? "gl_FragColor = vec4( outgoingLight, diffuseColor.a * vAlpha );"
                        : "gl_FragColor = vec4( outgoingLight, diffuseColor.a );";
                    if (clippingCode) {
                        shader.fragmentShader = shader.fragmentShader.replace(
                            insertionPoint, clippingCode + "\n  " + insertionPoint
                        );
                    }
                }
            };
            return material;
        }

        // --- generateGlowCircleTexture (L546-579) ---
        function generateGlowCircleTexture() {
            const e = document.createElement("canvas");
            e.width = 256; e.height = 256;
            const o = e.getContext("2d");
            const s = o.createRadialGradient(128, 128, 50.800000000000004, 128, 128, 127);
            s.addColorStop(0, "rgba(255,255,255,0.6)");
            s.addColorStop(1, "rgba(255,255,255,0)");
            o.fillStyle = s;
            o.beginPath(); o.arc(128, 128, 127, 0, 2 * Math.PI); o.closePath(); o.fill();
            const r = o.createRadialGradient(128, 128, 0, 128, 128, 76.2);
            r.addColorStop(0, "rgba(255,255,255,1)");
            r.addColorStop(1, "rgba(255,255,255,0)");
            o.fillStyle = r;
            o.beginPath(); o.arc(128, 128, 76.2, 0, 2 * Math.PI); o.closePath(); o.fill();
            const n = new THREE.CanvasTexture(e);
            n.minFilter = THREE.LinearFilter;
            n.magFilter = THREE.LinearFilter;
            n.needsUpdate = true;
            return n;
        }

        const heartInitialColor = new THREE.Color(255 / 255, 90 / 255, 90 / 255);  // y hệt màu hạt galaxy: vec3(255,90,90)
        const circleTexture = generateGlowCircleTexture();

        // --- heartShape (L583-591) ---
        const heartShape = new THREE.Shape();
        heartShape.moveTo(5, 2);
        heartShape.bezierCurveTo(5, 2, 4, 0, 0, 0);
        heartShape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
        heartShape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
        heartShape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
        heartShape.bezierCurveTo(16, 7, 16, 0, 10, 0);
        heartShape.bezierCurveTo(7, 0, 5, 2, 5, 2);
        const polyPts = heartShape.getPoints(100);

        function isPointInsidePolygon(t, e) {
            let o = false;
            let a = 0;
            for (let s = e.length - 1; a < e.length; s = a++) {
                const r = e[a].x, n = e[a].y, i = e[s].x, c = e[s].y;
                if (n > t.y != c > t.y && t.x < ((i - r) * (t.y - n)) / (c - n) + r) o = !o;
            }
            return o;
        }
        const polyShift = polyPts.map((t) => ({ x: t.x - 5, y: t.y - 7 }));
        const BORDER_THRESHOLD = 0.1 * (Math.max(...polyPts.map((t) => t.x)) - Math.min(...polyPts.map((t) => t.x)));
        function calculateMinimumDistanceToBorder(t, e) {
            let a = Infinity;
            for (let s = 0; s < polyShift.length; s++) {
                const r = polyShift[s];
                const n = polyShift[(s + 1) % polyShift.length];
                const i = n.x - r.x, c = n.y - r.y;
                const l = ((t - r.x) * i + (e - r.y) * c) / (i * i + c * c);
                const x = Math.max(0, Math.min(1, l));
                const m = (t - (r.x + x * i)) ** 2 + (e - (r.y + x * c)) ** 2;
                if (m < a) a = m;
            }
            return Math.sqrt(a);
        }

        // --- Lấy mẫu 7000 hạt (L781-822) ---
        const hPositions = [];
        const hxs = polyPts.map((t) => t.x);
        const hys = polyPts.map((t) => t.y);
        const minX = Math.min(...hxs), maxX = Math.max(...hxs);
        const minY = Math.min(...hys), maxY = Math.max(...hys);
        const threshold = minY + (maxY - minY) / 6;
        while (hPositions.length / 3 < (IS_MOBILE ? 12000 : 25000)) {
            const t = Math.random() * (maxX - minX) + minX;
            const e = Math.random() * (maxY - minY) + minY;
            if (isPointInsidePolygon({ x: t, y: e }, polyPts)) {
                let o = Infinity;
                for (let a = 0; a < polyPts.length; a++) {
                    const s = polyPts[a];
                    const r = polyPts[(a + 1) % polyPts.length];
                    const n = r.x - s.x, i = r.y - s.y;
                    const c = ((t - s.x) * n + (e - s.y) * i) / (n * n + i * i);
                    const l = Math.max(0, Math.min(1, c));
                    const x = t - (s.x + l * n);
                    const m = e - (s.y + l * i);
                    const _ = x * x + m * m;
                    if (_ < o) o = _;
                }
                const a = 1 / (1 + 2 * Math.sqrt(o));
                if (Math.random() < a) {
                    const o = 3.6 * (Math.random() - 0.5);
                    hPositions.push(t - 5, e - 7, o);
                }
            }
        }

        const heartWidth = maxX - minX;
        const INDENT_Y = maxY - 0.25 * (maxY - minY);
        const INDENT_HALF_WIDTH = 0.35 * heartWidth;

        // --- Tách top/bottom indices (L860-905) ---
        const HEART_SCALE = innerWidth < 768 ? 0.4 : 0.55;  // mobile thu nhỏ tim cho vừa màn (gốc ~22x19)
        const hStaticSizes = new Float32Array(hPositions.length / 3);
        for (let t = 0; t < hStaticSizes.length; t++) hStaticSizes[t] = HEART_SCALE * 0.8 * (0.3 * Math.random() + 0.2);

        const hTopIndices = [];
        for (let t = 0; t < hPositions.length; t += 3) {
            if (hPositions[t + 1] > threshold + 0.1 * (Math.random() - 0.5) * (maxY - minY)) hTopIndices.push(t / 3);
        }
        const hTopSet = new Set(hTopIndices);

        let hBottomPositions = [];
        const hBottomColors = [];
        const hBottomSizes = [];
        const hTopPositionsArr = [];
        const hTopColors = [];
        const hTopSizes = [];
        const hTopAlpha = [];
        for (let t = 0; t < hPositions.length; t += 3) {
            const o = t / 3;
            const a = hStaticSizes[o];
            const s = hPositions[t], r = hPositions[t + 1], n = hPositions[t + 2];
            if (hTopSet.has(o)) {
                hTopPositionsArr.push(s, r, n);
                hTopColors.push(heartInitialColor.r, heartInitialColor.g, heartInitialColor.b);
                hTopSizes.push(a);
                const isIndent = Math.abs(s) < INDENT_HALF_WIDTH && r > INDENT_Y;
                hTopAlpha.push(isIndent ? 0 : 1);
            } else {
                hBottomPositions.push(s, r, n);
                hBottomColors.push(heartInitialColor.r, heartInitialColor.g, heartInitialColor.b);
                hBottomSizes.push(a);
            }
        }

        // --- staticHeart (top, L1070-1078) ---
        const hStaticGeo = new THREE.BufferGeometry();
        hStaticGeo.setAttribute("position", new THREE.Float32BufferAttribute(hTopPositionsArr, 3));
        hStaticGeo.setAttribute("color", new THREE.Float32BufferAttribute(hTopColors, 3));
        hStaticGeo.setAttribute("size", new THREE.Float32BufferAttribute(hTopSizes, 1));
        hStaticGeo.setAttribute("alpha", new THREE.BufferAttribute(new Float32Array(hTopAlpha), 1));
        const hMatStatic = makeMat({ map: circleTexture, alphaSupport: true });
        hMatStatic.alphaTest = 0.5;
        const staticHeart = new THREE.Points(hStaticGeo, hMatStatic);
        staticHeart.rotation.z = Math.PI;

        // --- bottomHeart rot/static split (L972-1010) ---
        const hRotPos = [], hRotColors = [], hRotSizes = [];
        const hStaticBotPos = [], hStaticBotColors = [], hStaticBotSizes = [];
        for (let t = 0; t < hBottomPositions.length; t += 3) {
            if (Math.random() < 0.2) {
                hRotPos.push(hBottomPositions[t], hBottomPositions[t + 1], hBottomPositions[t + 2]);
                hRotColors.push(heartInitialColor.r, heartInitialColor.g, heartInitialColor.b);
                hRotSizes.push(hBottomSizes[t / 3]);
            } else {
                hStaticBotPos.push(hBottomPositions[t], hBottomPositions[t + 1], hBottomPositions[t + 2]);
                hStaticBotColors.push(heartInitialColor.r, heartInitialColor.g, heartInitialColor.b);
                hStaticBotSizes.push(hBottomSizes[t / 3]);
            }
        }

        // --- bottomHeart (L1038-1067) ---
        const hBottomGeo = new THREE.BufferGeometry();
        hBottomGeo.setAttribute("position", new THREE.Float32BufferAttribute(hRotPos, 3));
        hBottomGeo.setAttribute("color", new THREE.Float32BufferAttribute(hRotColors, 3));
        hBottomGeo.setAttribute("size", new THREE.Float32BufferAttribute(hRotSizes, 1));
        hBottomGeo.setAttribute("alpha", new THREE.BufferAttribute(new Float32Array(hRotPos.length / 3).fill(1), 1));
        const hMatBottom = makeMat({ map: circleTexture, alphaSupport: true, vClipSlope: 0.3, clipFrontZ: 0.3 });
        hMatBottom.alphaTest = 0.5;
        const bottomHeart = new THREE.Points(hBottomGeo, hMatBottom);
        bottomHeart.rotation.z = Math.PI;

        // --- staticBottomHeart (L1120-1141) ---
        let staticBottomHeart = null;
        if (hStaticBotPos.length > 0) {
            const g = new THREE.BufferGeometry();
            g.setAttribute("position", new THREE.Float32BufferAttribute(hStaticBotPos, 3));
            g.setAttribute("color", new THREE.Float32BufferAttribute(hStaticBotColors, 3));
            g.setAttribute("size", new THREE.Float32BufferAttribute(hStaticBotSizes, 1));
            const mat = makeMat({ map: circleTexture, alphaSupport: true });
            mat.alphaTest = 0.5;
            g.setAttribute("alpha", new THREE.BufferAttribute(new Float32Array(hStaticBotPos.length / 3).fill(1), 1));
            staticBottomHeart = new THREE.Points(g, mat);
            staticBottomHeart.rotation.z = Math.PI;
        }

        // --- staticTopHeart (L1079-1118) ---
        let staticTopHeart = null;
        {
            const tArr = [], eArr = [], oArr = [];
            for (let a = 0; a < hTopPositionsArr.length; a += 3) {
                const inside = calculateMinimumDistanceToBorder(
                    hTopPositionsArr[a] + 5, hTopPositionsArr[a + 1] + 7
                ) < BORDER_THRESHOLD || Math.random() < 0.3;
                if (Math.random() < 0.5 && inside) {
                    tArr.push(hTopPositionsArr[a], hTopPositionsArr[a + 1], hTopPositionsArr[a + 2]);
                    eArr.push(heartInitialColor.r, heartInitialColor.g, heartInitialColor.b);
                    oArr.push(hTopSizes[Math.floor(a / 3)]);
                }
            }
            if (tArr.length) {
                const g = new THREE.BufferGeometry();
                g.setAttribute("position", new THREE.Float32BufferAttribute(tArr, 3));
                g.setAttribute("color", new THREE.Float32BufferAttribute(eArr, 3));
                g.setAttribute("size", new THREE.Float32BufferAttribute(oArr, 1));
                g.setAttribute("alpha", new THREE.BufferAttribute(new Float32Array(tArr.length / 3).fill(1), 1));
                const mat = makeMat({ map: circleTexture, alphaSupport: true });
                mat.alphaTest = 0.5;
                staticTopHeart = new THREE.Points(g, mat);
                staticTopHeart.rotation.z = Math.PI;
            }
        }

        // --- Group + đặt phía trên lõi cầu ---
        const heartGroup = new THREE.Group();
        heartGroup.add(staticHeart);
        heartGroup.add(bottomHeart);
        if (staticBottomHeart) heartGroup.add(staticBottomHeart);
        if (staticTopHeart) heartGroup.add(staticTopHeart);
        heartGroup.scale.setScalar(HEART_SCALE);  // co nhỏ (shape gốc ~22x19) để khớp quy mô galaxy
        const HEART_Y = 19;
        heartGroup.position.set(0, HEART_Y, 0);    // trên lõi cầu (bán kính ~10)
        scene.add(heartGroup);

        // === 3D text sprites cạnh trái tim (typewriter giống Heart_Valentine) ===
        // Heart center world: (0, 19, 0); sau scale 0.55, bán kính ngang ~6, dọc ~5.25
        const TEXT_X = IS_MOBILE ? 0 : 16;                    // cạnh phải tim, gap vừa
        const TITLE_Y = HEART_Y + (IS_MOBILE ? 6.5 : 1.3);
        const MSG_Y   = HEART_Y + (IS_MOBILE ? 4 : -1.4);

        function makeTextSprite(canvasW, canvasH, px) {
            const c = document.createElement('canvas');
            c.width = canvasW * px; c.height = canvasH * px;
            const ctx = c.getContext('2d');
            ctx.scale(px, px);
            const tex = new THREE.CanvasTexture(c);
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            const mat = new THREE.SpriteMaterial({
                map: tex, transparent: true, depthTest: false, depthWrite: false
            });
            mat.toneMapped = false;
            return { sprite: new THREE.Sprite(mat), canvas: c, ctx, texture: tex, w: canvasW, h: canvasH };
        }

        function drawGlowText(ctx, text, x, y, font, color) {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = font;
            ctx.shadowColor = 'rgba(255, 20, 147, 0.85)';
            ctx.shadowBlur = 28;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
            ctx.shadowColor = 'rgba(255, 105, 180, 0.85)';
            ctx.shadowBlur = 16;
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 6;
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
            ctx.fillText(text, x, y);
        }

        // --- Title sprite (static) ---
        const TITLE_CW = 1024, TITLE_CH = 200;
        const titleObj = makeTextSprite(TITLE_CW, TITLE_CH, 2);
        const titleSpriteW = 13;
        titleObj.sprite.scale.set(titleSpriteW, titleSpriteW * TITLE_CH / TITLE_CW, 1);
        titleObj.sprite.position.set(TEXT_X, TITLE_Y, 0);
        titleObj.sprite.renderOrder = 1200;
        scene.add(titleObj.sprite);

        const MAIN_TITLE_TEXT = __APP_CONFIG__.title || 'Gửi Em 💘';
        function drawTitle() {
            const c = titleObj.ctx;
            c.clearRect(0, 0, TITLE_CW, TITLE_CH);
            drawGlowText(c, MAIN_TITLE_TEXT, 12, TITLE_CH / 2,
                '400 78px "Pacifico", "Great Vibes", cursive', '#ff4d8a');
            titleObj.texture.needsUpdate = true;
        }
        drawTitle();
        // Pacifico load async từ Google Fonts → vẽ lại khi font sẵn sàng
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(drawTitle);
        }

        // --- Messages sprite (typewriter cycle) ---
        const MSG_CW = 1024, MSG_CH = 130;
        const msgObj = makeTextSprite(MSG_CW, MSG_CH, 2);
        const msgSpriteW = 13;
        msgObj.sprite.scale.set(msgSpriteW, msgSpriteW * MSG_CH / MSG_CW, 1);
        msgObj.sprite.position.set(TEXT_X, MSG_Y, 0);
        msgObj.sprite.renderOrder = 1200;
        scene.add(msgObj.sprite);

        const msgList = (Array.isArray(__APP_CONFIG__.messages) && __APP_CONFIG__.messages.length)
            ? __APP_CONFIG__.messages
            : [
                "Gặp được em là điều may mắn nhất của anh 💖",
                "Cảm ơn em đã bước vào cuộc đời anh 🌹",
                "Anh yêu em nhiều lắm, mãi mãi bên em nhé 💞",
                "Mỗi ngày có em là một ngày hạnh phúc ✨"
            ];
        const MSG_FONT_BASE = 48;
        const msgFontAt = (px) => `italic 500 ${px}px "Mali", "Noto Sans", sans-serif`;
        let MSG_FONT = msgFontAt(MSG_FONT_BASE);
        // auto-fit font size theo câu dài nhất để không bị tràn canvas
        (function fitMsgFont() {
            const probeCtx = msgObj.ctx;
            const padding = 12 + 12 + 4 + 3; // left padding + cursor gap + cursor width
            let size = MSG_FONT_BASE;
            for (const s of msgList) {
                let cur = MSG_FONT_BASE;
                while (cur > 14) {
                    probeCtx.font = msgFontAt(cur);
                    if (probeCtx.measureText(s).width + padding <= MSG_CW) break;
                    cur -= 1;
                }
                if (cur < size) size = cur;
            }
            MSG_FONT = msgFontAt(size);
        })();
        let msgIdx = 0, msgChar = 0, msgPhase = 'typing', msgPhaseT = 0;
        let cursorBlink = 0, cursorVis = true, msgLastTime = null;
        // Cache để skip redraw khi không có gì đổi (mobile: tránh upload 1024x130 texture mỗi frame)
        let lastDrawnIdx = -1, lastDrawnChar = -1, lastDrawnCursor = null;

        function updateMessageSprite(elapsed) {
            if (msgLastTime == null) { msgLastTime = elapsed; }
            const dt = Math.min(0.1, elapsed - msgLastTime);
            msgLastTime = elapsed;

            cursorBlink += dt;
            if (cursorBlink > 0.4) { cursorVis = !cursorVis; cursorBlink = 0; }
            msgPhaseT += dt;

            const full = msgList[msgIdx];
            if (msgPhase === 'typing' && msgPhaseT > 0.07) {
                msgPhaseT = 0; msgChar++;
                if (msgChar >= full.length) { msgChar = full.length; msgPhase = 'hold'; msgPhaseT = 0; }
            } else if (msgPhase === 'hold' && msgPhaseT > 1.8) {
                msgPhase = 'erasing'; msgPhaseT = 0;
            } else if (msgPhase === 'erasing' && msgPhaseT > 0.035) {
                msgPhaseT = 0; msgChar--;
                if (msgChar <= 0) { msgChar = 0; msgPhase = 'wait'; msgPhaseT = 0; }
            } else if (msgPhase === 'wait' && msgPhaseT > 0.4) {
                msgIdx = (msgIdx + 1) % msgList.length;
                msgPhase = 'typing'; msgPhaseT = 0;
            }

            // Frame này không có gì đổi → skip clearRect/drawGlowText/needsUpdate
            if (msgIdx === lastDrawnIdx && msgChar === lastDrawnChar && cursorVis === lastDrawnCursor) return;
            lastDrawnIdx = msgIdx; lastDrawnChar = msgChar; lastDrawnCursor = cursorVis;

            const c = msgObj.ctx;
            c.clearRect(0, 0, MSG_CW, MSG_CH);
            const visText = full.substring(0, msgChar);
            drawGlowText(c, visText, 12, MSG_CH / 2, MSG_FONT, 'rgba(255, 255, 255, 0.96)');
            if (cursorVis) {
                c.save();
                c.font = MSG_FONT;
                c.textAlign = 'left';
                c.textBaseline = 'middle';
                const m = c.measureText(visText);
                c.shadowColor = '#ff4d8a';
                c.shadowBlur = 12;
                c.fillStyle = '#ff4d8a';
                c.fillRect(12 + m.width + 4, MSG_CH / 2 - 24, 3, 48);
                c.restore();
            }
            msgObj.texture.needsUpdate = true;
        }

        // --- Reveal: hạt từ lõi cầu bay lên tụ thành tim (4s, easeOutCubic) ---
        const REVEAL_DURATION = 5.5;
        let revealStart = null;
        let revealDone = false;
        const revealData = heartGroup.children.map(h => {
            const posAttr = h.geometry.attributes.position;
            const target = new Float32Array(posAttr.array);
            const start = new Float32Array(target.length);
            const n = target.length / 3;
            for (let i = 0; i < n; i++) {
                // điểm ngẫu nhiên trên vỏ cầu world (khớp lõi galaxy L85-88)
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = Math.random() * 2 * Math.PI;
                const r = 9.5 + Math.random() * 0.5;
                const wx = r * Math.sin(phi) * Math.cos(theta);
                const wy = r * Math.cos(phi);
                const wz = r * Math.sin(phi) * Math.sin(theta);
                // world → child local: inverse group (translate + scale), rồi inverse child rotation.z=PI
                start[i * 3]     = -(wx / HEART_SCALE);
                start[i * 3 + 1] = -((wy - HEART_Y) / HEART_SCALE);
                start[i * 3 + 2] =  (wz / HEART_SCALE);
            }
            // khởi tạo vị trí ở sphere để frame đầu không flash
            posAttr.array.set(start);
            posAttr.needsUpdate = true;
            return { posAttr, target, start };
        });

        // --- Post-processing: AfterimagePass tạo trail cho tim đập ---
        // Mobile bỏ hẳn composer (3 full-screen pass/frame quá nặng cho Mali mid-range) → render thẳng
        let composer = null;
        if (!IS_MOBILE && !reducedMotion) {
            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            const afterimagePass = new AfterimagePass();
            afterimagePass.uniforms['damp'].value = 0.82;
            composer.addPass(afterimagePass);
        }

        // === Rải thưa ảnh vào đĩa xoáy (L88-95): tổng ~100 ảnh ===
        const photoFiles = (Array.isArray(__APP_CONFIG__.images) && __APP_CONFIG__.images.length)
            ? __APP_CONFIG__.images
            : ['anh1.jpeg', 'anh2.jpeg', 'anh3.jpeg', 'anh4.jpeg', 'anh5.jpeg', 'anh6.jpeg', 'anh7.jpeg'];
        const resolvePhotoSrc = (file) => file;
        const numPhotos = photoFiles.length;
        const totalPhotoInstances = IS_MOBILE ? 700 : 1600;
        const pointsPerPhoto = Math.max(3, Math.ceil(totalPhotoInstances / numPhotos));

        function createRoundedTexture(img, size = 256) {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;
            const ctx = canvas.getContext('2d');
            const aspect = img.width / img.height;
            let dw, dh, ox, oy;
            if (aspect > 1) { dw = size; dh = size / aspect; ox = 0; oy = (size - dh) / 2; }
            else { dh = size; dw = size * aspect; ox = (size - dw) / 2; oy = 0; }
            const r = size * 0.15;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(ox + r, oy);
            ctx.arcTo(ox + dw, oy, ox + dw, oy + r, r);
            ctx.arcTo(ox + dw, oy + dh, ox + dw - r, oy + dh, r);
            ctx.arcTo(ox, oy + dh, ox, oy + dh - r, r);
            ctx.arcTo(ox, oy, ox + r, oy, r);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, ox, oy, dw, dh);
            ctx.restore();
            const tex = new THREE.CanvasTexture(canvas);
            if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        }

        const photoClouds = [];
        photoFiles.forEach((file, fileIdx) => {
            const positions = new Float32Array(pointsPerPhoto * 3);
            const rIn = 16, rOut = 85;
            const slice = (Math.PI * 2) / pointsPerPhoto;

            for (let i = 0; i < pointsPerPhoto; i++) {
                const radius = Math.sqrt(rIn * rIn + Math.random() * (rOut * rOut - rIn * rIn));
                const theta = (i + fileIdx / numPhotos + Math.random()) * slice;
                const y = (Math.random() - 0.5) * 2;

                positions[i * 3] = Math.cos(theta) * radius;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = Math.sin(theta) * radius;
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.src = resolvePhotoSrc(file);
            img.onload = () => {
                const tex = createRoundedTexture(img, 256);
                const baseSize = Math.max(2.0, Math.min(3.5, innerWidth / 600));
                const mat = new THREE.PointsMaterial({
                    size: baseSize,
                    map: tex,
                    color: 0xffffff,
                    transparent: true,
                    alphaTest: 0.25,
                    depthWrite: false,
                    sizeAttenuation: true
                });
                const photoPoints = new THREE.Points(geo, mat);
                photoPoints.userData.fileIndex = fileIdx;
                photoPoints.name = `galaxy-photos-${fileIdx}`;
                photoClouds.push(photoPoints);
                p.add(photoPoints);
            };
        });

        window.addEventListener('resize', () => {
            const baseSize = Math.max(2.0, Math.min(3.5, innerWidth / 600));
            p.children.forEach(child => {
                if (child.material && child.material.map && child.material.size !== undefined) {
                    child.material.size = baseSize;
                }
            });
        });


// Photo picking uses the same rotating point clouds that are visible on screen.
const viewer = document.getElementById('photo-viewer');
const viewerImage = document.getElementById('viewer-image');
const viewerCount = document.getElementById('viewer-count');
const viewerCaption = document.getElementById('viewer-caption');
let selectedPhoto = 0;
let previousFocus = null;
function displayPhoto(index) {
    selectedPhoto = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[selectedPhoto];
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt || `Kỷ niệm ${selectedPhoto + 1}`;
    viewerCount.textContent = `${String(selectedPhoto + 1).padStart(2, '0')} / ${String(galleryPhotos.length).padStart(2, '0')}`;
    viewerCaption.textContent = photo.wish || photo.caption || '';
}
function openPhoto(index) {
    cinematic.cancel();
    previousFocus = document.activeElement;
    displayPhoto(index);
    controls.enabled = false;
    controls.autoRotate = false;
    if (!viewer.open) viewer.showModal();
}
viewer.addEventListener('close', () => {
    controls.enabled = true;
    resetIdleTimer();
    previousFocus?.focus({preventScroll: true});
});
document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
document.getElementById('viewer-prev').addEventListener('click', () => displayPhoto(selectedPhoto - 1));
document.getElementById('viewer-next').addEventListener('click', () => displayPhoto(selectedPhoto + 1));
// A tap opens the dialog on pointerup. Its following synthetic click must not
// immediately close it as a backdrop click on touch devices.
let startedOnBackdrop = false;
viewer.addEventListener('pointerdown', event => { startedOnBackdrop = event.target === viewer; });
viewer.addEventListener('pointerup', event => {
    if (startedOnBackdrop && event.target === viewer) viewer.close();
    startedOnBackdrop = false;
});
viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        displayPhoto(selectedPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
    }
});
document.getElementById('gallery-open').addEventListener('click', () => openPhoto(0));
const cinematic = createGalaxyCinematic({
    THREE, scene, camera, controls, heartGroup, canvas: renderer.domElement, reducedMotion,
    onStart() { clearTimeout(idleTimer); controls.autoRotate = false; },
    onEnd() { resetIdleTimer(); },
});


const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 1.25;
const pointer = new THREE.Vector2();
function photoAt(clientX, clientY) {
    pointer.set(clientX / innerWidth * 2 - 1, -clientY / innerHeight * 2 + 1);
    camera.updateMatrixWorld();
    p.updateWorldMatrix(true, true);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(photoClouds, false)[0];
}
const activePointers = new Set();
let tapStart = null;
renderer.domElement.tabIndex = 0;
renderer.domElement.setAttribute('aria-label', 'Ngân hà ảnh tương tác');
renderer.domElement.addEventListener('pointerdown', event => {
    activePointers.add(event.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
    if (activePointers.size === 1) tapStart = {id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false};
    else if (tapStart) tapStart.dragged = true;
    resetIdleTimer();
});
renderer.domElement.addEventListener('pointermove', event => {
    if (tapStart && Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y) > 7) tapStart.dragged = true;
    if (!activePointers.size && event.pointerType !== 'touch') {
        renderer.domElement.style.cursor = cinematic.pick(event.clientX, event.clientY) || photoAt(event.clientX, event.clientY) ? 'pointer' : 'grab';
    }
});
renderer.domElement.addEventListener('pointerup', event => {
    activePointers.delete(event.pointerId);
    if (tapStart?.id === event.pointerId && !tapStart.dragged && !viewer.open) {
        const cinematicHit = cinematic.pick(event.clientX, event.clientY);
        const hit = photoAt(event.clientX, event.clientY);
        if (cinematicHit && (!hit || cinematicHit.distance <= hit.distance)) cinematic.start();
        else if (hit) openPhoto(hit.object.userData.fileIndex);
    }
    if (!activePointers.size) {
        tapStart = null;
        renderer.domElement.style.cursor = 'grab';
        resetIdleTimer();
    }
});
renderer.domElement.addEventListener('pointercancel', event => {
    activePointers.delete(event.pointerId);
    tapStart = null;
    renderer.domElement.style.cursor = 'grab';
    resetIdleTimer();
});
window.addEventListener('blur', () => {
    activePointers.clear(); tapStart = null;
    for (const key of Object.keys(keys)) keys[key] = false;
});

controls.autoRotateSpeed = 0.35;
controls.autoRotate = false;
let idleTimer;
function resetIdleTimer() {
    controls.autoRotate = false;
    clearTimeout(idleTimer);
    if (!reducedMotion) idleTimer = setTimeout(() => {
        if (controls.enabled && !activePointers.size && !viewer.open && !cinematic.active) controls.autoRotate = true;
    }, 5000);
}
controls.addEventListener('start', resetIdleTimer);
controls.addEventListener('end', resetIdleTimer);
resetIdleTimer();
document.getElementById('view-reset').addEventListener('click', () => {
    cinematic.cancel();
    controls.autoRotate = false;
    const damping = controls.enableDamping;
    controls.enableDamping = false;
    controls.update();
    camera.position.copy(defaultCameraPosition);
    controls.target.copy(defaultCameraTarget);
    controls.update();
    controls.enableDamping = damping;
    resetIdleTimer();
});

const clock = new THREE.Clock();
let sceneElapsed = 0;
let rotOffset = 0;
const PHOTO_DRIFT_RADIANS_PER_SECOND = 0.05; // Twice the previous 0.025 rad/s.
renderer.setAnimationLoop(() => {
    const frameDelta = Math.min(clock.getDelta(), 0.25);
    const delta = Math.min(frameDelta, 0.05);
    if (document.hidden) return;
    if (!viewer.open) {
        sceneElapsed += delta;
        if (!cinematic.active) {
        if (keys.ArrowLeft) rotOffset -= delta * 0.9;
        if (keys.ArrowRight) rotOffset += delta * 0.9;
        if (keys.ArrowUp) camera.position.y = Math.min(camera.position.y + delta * 12, 90);
        if (keys.ArrowDown) camera.position.y = Math.max(camera.position.y - delta * 12, -70);
        controls.update();
        }
    }
    const elapsed = sceneElapsed;
    const time = reducedMotion ? 0 : elapsed * 0.5;
    gu.time.value = time * Math.PI;
    p.rotation.y = (reducedMotion ? 0 : elapsed * PHOTO_DRIFT_RADIANS_PER_SECOND) + rotOffset;
    updateMessageSprite(elapsed);
    if (!revealDone) {
        if (revealStart === null) revealStart = elapsed;
        const progress = reducedMotion ? 1 : Math.min(1, (elapsed - revealStart) / REVEAL_DURATION);
        const eased = 1 - Math.pow(1 - progress, 3);
        revealData.forEach(({posAttr, target, start}) => {
            const array = posAttr.array;
            for (let i = 0; i < array.length; i++) array[i] = start[i] + (target[i] - start[i]) * eased;
            posAttr.needsUpdate = true;
        });
        if (progress >= 1) revealDone = true;
    }
    if (revealDone) {
        const beat = reducedMotion ? 0 : Math.sin(elapsed * Math.PI);
        heartGroup.scale.setScalar(HEART_SCALE * (1 + 0.05 * beat));
        heartGroup.children.forEach(heart => { heart.material.opacity = 0.85 + 0.15 * beat; });
    }
    cinematic.update(viewer.open ? 0 : frameDelta);
    if (composer) composer.render();
    else renderer.render(scene, camera);
    if (!window.__firstRendered) {
        window.__firstRendered = true;
        document.getElementById('galaxy-loading').hidden = true;
        document.body.dataset.ready = 'true';
    }
});
window.addEventListener('pagehide', () => {
    clearTimeout(idleTimer);
    renderer.setAnimationLoop(null);
    cinematic.dispose();
    controls.dispose();
    const textures = new Set();
    scene.traverse(object => {
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
        for (const material of materials) {
            if (material.map) textures.add(material.map);
            material.dispose();
        }
    });
    textures.forEach(texture => texture.dispose());
    if (composer) {
        composer.renderTarget1.dispose();
        composer.renderTarget2.dispose();
        composer.copyPass.material.dispose();
        composer.copyPass.fsQuad.dispose();
        for (const pass of composer.passes) {
            pass.textureComp?.dispose();
            pass.textureOld?.dispose();
            pass.compFsQuad?.material.dispose();
            pass.compFsQuad?.dispose();
            pass.copyFsQuad?.material.dispose();
            pass.copyFsQuad?.dispose();
        }
    }
    renderer.dispose();
    renderer.forceContextLoss();
}, {once: true});
