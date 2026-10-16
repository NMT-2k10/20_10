/* Native media playback: some browsers can play M4A in <audio> but cannot
   decode the same file with AudioContext.decodeAudioData(). */
window.createGiftAudio = function createGiftAudio(music) {
  const audio = document.createElement('audio');
  audio.id = 'gift-music';
  audio.hidden = true;
  audio.preload = 'auto';
  audio.setAttribute('playsinline', '');
  audio.dataset.track = music.intro ? 'intro' : 'loop';
  audio.dataset.state = 'ready';
  audio.src = music.intro || music.loop;
  audio.loop = !music.intro;
  audio.volume = 0.8;

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.hidden = true;
  retry.textContent = 'Bấm để bật nhạc 🎵';
  retry.style.cssText = 'position:fixed;right:16px;top:68px;z-index:90;border:1px solid #ffffff70;border-radius:24px;padding:10px 16px;background:#fff2df;color:#7a2c40;cursor:pointer;font:14px sans-serif;box-shadow:0 4px 16px #4a1c2c22';
  document.body.append(audio, retry);

  let requested = false;
  let disposed = false;
  let fade = 0;
  let generation = 0;
  let pausedForVisibility = false;
  let giftTrack = null;
  let pendingSeek = null;

  function failed(error) {
    if (disposed) return;
    audio.dataset.state = 'blocked';
    retry.hidden = !requested || audio.muted;
    console.warn('Gift music could not play:', error);
  }

  function play() {
    if (disposed || !requested) return;
    const attempt = ++generation;
    audio.dataset.state = 'starting';
    // Call play() directly from the click handler, before awaiting anything.
    audio.play().then(() => {
      if (!disposed && attempt === generation) {
        audio.dataset.state = 'playing';
        retry.hidden = true;
      }
    }).catch(error => {
      if (attempt === generation && error.name !== 'AbortError') failed(error);
    });
  }

  function start() {
    if (disposed) return;
    requested = true;
    if (audio.error) audio.load();
    play();
  }

  audio.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null) {
      audio.currentTime = pendingSeek;
      pendingSeek = null;
    }
  });

  function setScene(scene) {
    if (disposed || !music.galaxy) return;
    const galaxy = scene === 'galaxy';
    if (galaxy === (audio.dataset.track === 'galaxy')) return;
    ++generation;
    audio.pause();
    retry.hidden = true;
    pausedForVisibility = false;
    if (galaxy) {
      giftTrack = {src: audio.getAttribute('src'), track: audio.dataset.track, time: audio.currentTime, loop: audio.loop};
      pendingSeek = null;
      audio.dataset.track = 'galaxy';
      audio.src = music.galaxy;
      audio.loop = true;
    } else if (giftTrack) {
      audio.dataset.track = giftTrack.track;
      pendingSeek = giftTrack.time;
      audio.src = giftTrack.src;
      audio.loop = giftTrack.loop;
      giftTrack = null;
    }
    requested = true;
    play();
  }

  audio.addEventListener('ended', () => {
    if (disposed || audio.dataset.track !== 'intro') return;
    audio.dataset.track = 'loop';
    audio.src = music.loop;
    audio.loop = true;
    play();
  });
  audio.addEventListener('error', () => failed(audio.error));
  audio.addEventListener('playing', () => {
    audio.dataset.state = 'playing';
    retry.hidden = true;
  });
  retry.addEventListener('click', start);

  function visibility() {
    if (!requested || disposed) return;
    if (document.hidden) {
      pausedForVisibility = !audio.paused;
      if (pausedForVisibility) {
        ++generation;
        audio.pause();
        audio.dataset.state = 'paused';
      }
    } else if (pausedForVisibility) {
      pausedForVisibility = false;
      play();
    }
  }
  document.addEventListener('visibilitychange', visibility);

  return {
    start,
    setScene,
    setMuted(muted) {
      audio.muted = Boolean(muted);
      if (muted) retry.hidden = true;
      else if (requested && audio.paused) play();
    },
    setVolume(value, seconds = 1.2) {
      cancelAnimationFrame(fade);
      const to = Math.max(0, Math.min(1, value));
      const from = audio.volume;
      const began = performance.now();
      function step(now) {
        if (disposed) return;
        const progress = seconds > 0 ? Math.min(1, (now - began) / (seconds * 1000)) : 1;
        audio.volume = from + (to - from) * progress;
        if (progress < 1) fade = requestAnimationFrame(step);
      }
      fade = requestAnimationFrame(step);
    },
    destroy() {
      disposed = true;
      ++generation;
      cancelAnimationFrame(fade);
      document.removeEventListener('visibilitychange', visibility);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.remove();
      retry.remove();
    }
  };
};
