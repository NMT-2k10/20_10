/* Local entry point. The published component and its animation libraries are
   kept unchanged in _next/static/chunks. Text/photos come from gift.json. */
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  document.currentScript,
  900001,
  function (runtime) {
    const React = runtime.r(71645);
    const ReactDOM = runtime.r(88014);
    const { GiftExperience } = runtime.r(33882);
    ReactDOM.createRoot(document.getElementById('app')).render(
      React.createElement(GiftExperience, { gift: window.GIFT_CONFIG })
    );
  }
]);
