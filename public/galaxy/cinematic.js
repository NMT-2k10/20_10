/* Camera tour adapted from the public reference's cinematic intro:
 * core reveal -> heart arc/panorama -> spiral descent -> fly-through.
 * One timeline is updated by the scene loop; dragging, zooming or Escape
 * cancels it immediately so orbit controls never fight the camera animation.
 */
export function createGalaxyCinematic({THREE, scene, camera, controls, heartGroup, canvas, reducedMotion, onStart, onEnd}) {
    const abort = new AbortController();
    const listen = (element, type, handler, options = {}) => element.addEventListener(type, handler, {...options, signal: abort.signal});
    const target = new THREE.Mesh(new THREE.SphereGeometry(innerWidth < 768 ? 4.8 : 6.5, 24, 16), new THREE.MeshBasicMaterial({visible: false}));
    target.name = 'galaxy-heart-target';
    target.position.copy(heartGroup.position).add(new THREE.Vector3(0, -1, 0));
    scene.add(target);
    const coreTarget = new THREE.Mesh(new THREE.SphereGeometry(10.5, 24, 16), new THREE.MeshBasicMaterial({visible: false}));
    coreTarget.name = 'galaxy-core-target';
    scene.add(coreTarget);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const origin = new THREE.Vector3();
    const heart = heartGroup.position.clone();
    const pose = new THREE.Vector3();
    const look = new THREE.Vector3();
    const baseFov = camera.fov;
    let running = false;
    let segments = [];
    let index = 0;
    let elapsed = 0;
    let damping = controls.enableDamping;
    const sine = t => .5 - .5 * Math.cos(Math.PI * t);
    const smooth = t => t * t * (3 - 2 * t);
    const cubic = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const vector = (x, y, z) => new THREE.Vector3(x, y, z);
    function bridge(name, from, to, fromLook, toLook, duration) {
        return {name, duration, sample(t) {
            pose.lerpVectors(from, to, sine(t));
            look.lerpVectors(fromLook, toLook, sine(t));
        }};
    }
    function pause(position, lookAt, duration) {
        return {name: 'pause', duration, sample() {pose.copy(position); look.copy(lookAt);}};
    }
    function setState() {
        document.body.dataset.cinematicState = running ? 'playing' : 'idle';
        document.body.dataset.cinematicPhase = running ? segments[index].name : 'idle';
    }
    function stop() {
        if (!running) return;
        running = false;
        camera.fov = baseFov;
        camera.updateProjectionMatrix();
        controls.enableDamping = damping;
        controls.enabled = true;
        controls.update();
        segments = [];
        setState();
        onEnd();
    }
    function start() {
        if (running || document.querySelector('dialog[open]')) return;
        onStart();
        controls.autoRotate = false;
        damping = controls.enableDamping;
        controls.enableDamping = false;
        controls.update();
        const current = camera.position.clone();
        const currentLook = controls.target.clone();
        controls.enabled = false;
        const home = innerWidth < 768 ? vector(0, 10, 39) : vector(0, 9, 34);
        const core = vector(0, 0, 3);
        const heartFront = vector(0, 19, 15);
        const heartBack = vector(0, 19, -15);
        const panorama = vector(0, 40, -55);
        const panoramaLook = vector(0, 8, 0);
        const sky = vector(-30, 80, 0);
        const descentEnd = vector(0, 19, 18);
        const flyStart = vector(0, 5, 40);
        const flyPath = new THREE.CatmullRomCurve3([flyStart, vector(0, -5, 5), heartFront]);
        segments = [
            bridge('enter-core', current, core, currentLook, origin, .9),
            {name: 'zoom-out', duration: 13, sample(t) {
                const progress = t * 1.15;
                if (progress < .2) pose.lerpVectors(core, vector(0, 0, 20), progress / .2);
                else if (progress < .75) pose.lerpVectors(vector(0, 0, 20), vector(0, 0, 60), (progress - .2) / .55);
                else pose.lerpVectors(vector(0, 0, 60), home, sine((progress - .75) / .4));
                look.copy(origin);
            }},
            pause(home, origin, .4),
            bridge('approach-heart', home, heartFront, origin, heart, 2.5),
            {name: 'panorama', duration: 10, sample(t) {
                if (t < .5) {
                    const angle = Math.PI / 2 + Math.PI * smooth(t * 2);
                    pose.set(Math.cos(angle) * 15, heart.y, Math.sin(angle) * 15);
                    look.copy(heart);
                } else {
                    const progress = smooth((t - .5) * 2);
                    pose.lerpVectors(heartBack, panorama, progress);
                    look.lerpVectors(heart, panoramaLook, progress);
                }
            }},
            pause(panorama, panoramaLook, .4),
            bridge('rise', panorama, sky, panoramaLook, origin, 3),
            {name: 'spiral-descent', duration: 12, sample(t) {
                const progress = cubic(t);
                const angle = Math.PI + Math.PI * 1.5 * progress;
                const radius = 30 - 12 * progress;
                pose.set(Math.cos(angle) * radius, 80 - 61 * progress, Math.sin(angle) * radius);
                look.lerpVectors(origin, heart, progress);
            }},
            bridge('return-home', descentEnd, home, heart, origin, 4),
            pause(home, origin, .4),
            bridge('approach-disc', home, flyStart, origin, origin, 1.8),
            {name: 'fly-through', duration: 11, sample(t) {
                const progress = t + .35 * Math.sin(2 * Math.PI * t) / (2 * Math.PI);
                flyPath.getPoint(progress, pose);
                look.lerpVectors(origin, heart, progress * progress);
                camera.fov = baseFov + 15 * Math.sin(t * Math.PI);
            }},
        ];
        if (reducedMotion) {
            // Keep a gentle overview transition instead of fast orbit/warp motion.
            const overview = vector(0, 40, 65);
            segments = [
                bridge('overview', current, overview, currentLook, panoramaLook, 1.2),
                bridge('return-view', overview, current, panoramaLook, currentLook, 1.2),
            ];
        }
        index = 0; elapsed = 0; running = true;
        setState();
    }
    function update(delta) {
        if (!running) return;
        elapsed += delta;
        while (elapsed >= segments[index].duration) {
            const segment = segments[index];
            segment.sample(1);
            camera.position.copy(pose);
            controls.target.copy(look);
            camera.lookAt(look);
            elapsed -= segment.duration;
            index++;
            if (index === segments.length) { stop(); return; }
            setState();
        }
        camera.fov = baseFov;
        const segment = segments[index];
        segment.sample(Math.min(1, elapsed / segment.duration));
        camera.position.copy(pose);
        controls.target.copy(look);
        camera.lookAt(look);
        camera.updateProjectionMatrix();
    }
    function pick(x, y) {
        pointer.set(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1);
        camera.updateMatrixWorld();
        target.updateWorldMatrix(true, false);
        coreTarget.updateWorldMatrix(true, false);
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObjects([target, coreTarget], false)[0] || null;
    }
    listen(canvas, 'keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); start();
        }
    });
    listen(canvas, 'pointerdown', stop, {capture: true});
    listen(canvas, 'wheel', stop, {capture: true, passive: true});
    listen(window, 'keydown', event => {
        if (['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) stop();
    });
    setState();
    return {get active() {return running;}, start, cancel: stop, update, pick, dispose() {abort.abort(); running = false; segments = [];}};
}
