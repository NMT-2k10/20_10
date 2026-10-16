document.getElementById('galaxy-back').addEventListener('click', () => {
  if (window.parent !== window) window.parent.postMessage({type: 'flower-garden:close-galaxy'}, window.location.origin);
  else window.location.assign('/');
});
try {
  await import('./scene.js');
} catch (error) {
  console.error('Galaxy could not start:', error);
  document.getElementById('galaxy-loading').textContent = 'Ảnh của chúng mình';
  const grid = document.createElement('div');
  grid.className = 'galaxy-fallback';
  const gift = window.parent.GIFT_CONFIG || {};
  const photos = gift.galaxy?.photos || gift.chapters?.flatMap(chapter => chapter.photos) || Array.from({length:12}, (_,i) => ({src:`/gift/photos/p${String(i+1).padStart(2,'0')}.jpg`}));
  // Keep photos accessible even on a device without a working WebGL context.
  for (const photo of photos) {
    const link = document.createElement('a');
    link.href = typeof photo === 'string' ? photo : photo.src;
    link.target = '_blank'; link.rel = 'noopener';
    const image = document.createElement('img');
    image.src = link.href; image.alt = 'Ảnh kỷ niệm';
    link.append(image); grid.append(link);
  }
  document.body.append(grid);
  document.querySelector('.galaxy-bottom-actions').hidden = true;
}
