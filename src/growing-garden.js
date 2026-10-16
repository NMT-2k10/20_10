/* Public reference browser build, formatted for editing. Original build is in public/_next/static/chunks. */
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  33066,
  (e) => {
    "use strict";
    var a = e.i(43476),
      t = e.i(71645),
      i = e.i(32181),
      n = e.i(72328),
      o = e.i(25031);
    let r = ["calm", "grow", "peak", "fall", "done"],
      l = [
        ["grow", 600],
        ["peak", 4e3],
        ["fall", 6200],
        ["done", 9e3],
      ],
      s = (e) => Math.round(100 * e) / 100;
    function d({ flower: e, tier: t, grown: n, falling: r, swaying: l, reduced: c, lean: u }) {
      let p = "high" === t,
        y = p || ("mid" === t && "bg" !== e.layer),
        f = (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsx)("div", {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                transform: `rotate(${e.angleDeg}deg)`,
                transformOrigin: "0 0",
              },
              children: (0, a.jsxs)("svg", {
                width: e.boxW,
                height: e.stemLen,
                viewBox: `0 0 ${e.boxW} ${e.stemLen}`,
                fill: "none",
                style: {
                  position: "absolute",
                  left: `${-e.boxW / 2}px`,
                  top: 0,
                  overflow: "visible",
                },
                children: [
                  (0, a.jsx)(i.f.path, {
                    d: e.stemPath,
                    stroke: e.stemTone,
                    strokeWidth: e.stemW,
                    strokeLinecap: "round",
                    initial: { opacity: e.stemRestOp },
                    animate: r ? { opacity: 0 } : { opacity: e.stemRestOp },
                    transition: r
                      ? { duration: 0.45 * e.fallDur, ease: "easeIn", delay: e.fallDelay }
                      : { duration: 0.3 },
                  }),
                  y && (0, a.jsx)(i.f.path, {
                    d: e.stemPath,
                    stroke: "#d9e2b5", strokeWidth: Math.max(0.45, e.stemW * 0.22),
                    strokeLinecap: "round", transform: `translate(${-e.stemW * 0.2} 0)`,
                    initial: { opacity: e.stemRestOp * 0.45 },
                    animate: { opacity: r ? 0 : e.stemRestOp * 0.45 },
                    transition: { duration: 0.4, delay: r ? e.fallDelay : 0 },
                  }),
                  y &&
                    e.leaves.map((t, n) => {
                      let l = (0.26 * e.headPx * t.scale) / 10,
                        d = e.boxW / 2 + t.side * e.headPx * 0.06,
                        c = e.headPx * t.yFrac;
                      return (0, a.jsx)(
                        "g",
                        {
                          transform: `translate(${s(d)} ${s(c)}) rotate(${t.rot}) scale(${s(l)})`,
                          children: (0, a.jsxs)(i.f.g, {
                            style: { transformBox: "fill-box", transformOrigin: "50% 0%" },
                            initial: { opacity: t.op, scale: 1 },
                            animate: r ? { opacity: 0, scale: 0.9 } : { opacity: t.op, scale: 1 },
                            transition: r
                              ? { duration: 0.4, ease: "easeIn", delay: e.fallDelay }
                              : { duration: 0.3 },
                            children: [
                              (0, a.jsx)("path", { d: o.o[t.shape], fill: t.tone }),
                              (0, a.jsx)("path", {
                                d: "M0 0 Q0.65 4.5 0 9 M0 3 L-1.6 1.7 M0.2 4.8 L1.8 3.1 M0.2 6.5 L-1.3 5",
                                stroke: "#dce5bb", strokeWidth: 0.16, opacity: 0.5,
                                fill: "none", strokeLinecap: "round",
                              }),
                            ],
                          }),
                        },
                        n,
                      );
                    }),
                ],
              }),
            }),
            (0, a.jsx)("div", {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                width: `${e.headPx}px`,
                transform: "translate(-50%,-50%)",
              },
              children: (0, a.jsx)(i.f.img, {
                src: e.src,
                className: p && "bg" !== e.layer ? "garden-flower-head" : void 0,
                alt: "",
                loading: "eager",
                decoding: "async",
                draggable: !1,
                style: {
                  // Compensate for the new cutouts' 10% padding on each side.
                  width: "125%",
                  maxWidth: "none",
                  marginLeft: "-12.5%",
                  height: "auto",
                  display: "block",
                  filter: p ? "drop-shadow(0 3px 7px rgba(0,0,0,0.32))" : "none",
                  willChange: p ? "transform, opacity" : void 0,
                  backfaceVisibility: "hidden",
                },
                initial: { opacity: e.headOp, scale: 0.85 },
                animate: n ? { scale: 1 } : { scale: 0.85 },
                transition: { duration: e.enterDur, ease: o.L.bloom, delay: e.growDelay },
              }),
            }),
          ],
        }),
        h = {
          duration: e.swayDur,
          repeat: c ? 0 : 1 / 0,
          ease: "easeInOut",
          delay: e.growDelay + e.enterDur,
        },
        m = [0, e.windAmp, 0, -(0.6 * e.windAmp), 0],
        x = [0, 1.8 * e.windAmp, 0, -(1.1 * e.windAmp), 0],
        g = {
          x: { duration: e.enterDur, ease: o.L.bloom, delay: e.growDelay },
          y: { duration: e.enterDur, ease: o.L.bloom, delay: e.growDelay },
          rotate: { duration: e.enterDur, ease: o.L.bloom, delay: e.growDelay },
          opacity: { duration: 0.5 * e.enterDur, ease: "easeOut", delay: e.growDelay },
        },
        w = {
          x: { duration: e.fallDur, ease: o.L.fall, delay: e.fallDelay },
          y: { duration: e.fallDur, ease: o.L.fall, delay: e.fallDelay },
          rotate: { duration: e.fallDur, ease: o.L.fall, delay: e.fallDelay },
          opacity: {
            duration: 0.6 * e.fallDur,
            ease: "easeIn",
            delay: e.fallDelay + 0.4 * e.fallDur,
          },
        };
      return (0, a.jsx)("div", {
        "aria-hidden": !0,
        className: "pointer-events-none absolute",
        style: { left: `${e.hx}px`, top: `${e.hy}px`, width: 0, height: 0, zIndex: e.z },
        children: (0, a.jsx)(i.f.div, {
          style: { position: "absolute", left: 0, top: 0, willChange: p ? "transform" : void 0 },
          initial: { x: e.fallX, y: e.fallY, rotate: e.enterRot, opacity: 0 },
          animate: r
            ? { x: e.fallX, y: e.fallY, rotate: e.fallRot, opacity: 0 }
            : n
              ? { x: 0, y: 0, rotate: 0, opacity: 1 }
              : { x: e.fallX, y: e.fallY, rotate: e.enterRot, opacity: 0 },
          transition: r ? w : n ? g : { duration: 0 },
          children: (0, a.jsx)(i.f.div, {
            style: { position: "absolute", left: 0, top: 0 },
            initial: !1,
            animate: u ?? { x: 0, y: 0, rotate: 0 },
            transition: {
              duration: 1.8,
              ease: o.L.bloom,
              delay: u ? 0.25 * (0, o.r)(e.hx, 61) : 0,
            },
            children: e.sway
              ? (0, a.jsx)(i.f.div, {
                  style: {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    willChange: p ? "transform" : void 0,
                  },
                  initial: { rotate: 0, x: 0 },
                  animate: l
                    ? p
                      ? { rotate: m, x: x }
                      : { rotate: m }
                    : p
                      ? { rotate: 0, x: 0 }
                      : { rotate: 0 },
                  transition: l ? (p ? { rotate: h, x: h } : { rotate: h }) : { duration: 0.3 },
                  children: f,
                })
              : f,
          }),
        }),
      });
    }
    e.s([
      "GrowingGarden",
      0,
      function ({
        palette: e,
        onRevealStart: c,
        onComplete: u,
        skippable: p = !0,
        tier: y,
        leanAt: f,
        timeline: h,
      }) {
        let m = (0, n.f)() ?? !1,
          [x] = (0, t.useState)(() => {
            let a,
              t,
              i =
                y ??
                ((a = window.matchMedia("(pointer: coarse)").matches),
                (t = navigator.deviceMemory ?? 8),
                a && t <= 2 ? "low" : a ? "mid" : "high"),
              n = window.innerWidth,
              r = window.innerHeight;
            return {
              tier: i,
              w: n,
              h: r,
              flowers: (0, o.f)(i, n, r, e.blooms),
              petals: (0, o.p)(i, e.petals.length ? e.petals : e.blooms),
              motes: (0, o.F)(i),
            };
          }),
          { tier: g, w, h: b, flowers: v, petals: D, motes: j } = x,
          $ = "low" === g,
          [k, O] = (0, t.useState)("calm"),
          [I, L] = (0, t.useState)(!1),
          R = (0, t.useRef)(c),
          z = (0, t.useRef)(u),
          T = (0, t.useRef)(!1),
          M = (0, t.useRef)(!1),
          N = (0, t.useRef)(0);
        ((0, t.useEffect)(() => {
          ((R.current = c), (z.current = u));
        }),
          (0, t.useEffect)(() => {
            N.current = Date.now();
            let e = l
              .map(([e, a]) => [e, h?.[e] ?? a])
              .map(([e, a]) =>
                window.setTimeout(() => {
                  (O(e),
                    "fall" !== e || T.current || ((T.current = !0), R.current?.()),
                    "done" !== e || M.current || ((M.current = !0), z.current?.()));
                }, a),
              );
            return (
              void 0 !== f && e.push(window.setTimeout(() => L(!0), f)),
              () => e.forEach((e) => window.clearTimeout(e))
            );
          }, [f, h]));
        let P = r.indexOf(k),
          W = (e) => P >= r.indexOf(e),
          A = W("fall"),
          C = W("grow"),
          B = C && !A,
          E = () => {
            p &&
              Date.now() - N.current >= 600 &&
              (M.current ||
                ((M.current = !0), T.current || ((T.current = !0), R.current?.()), z.current?.()));
          };
        return (0, a.jsxs)("div", {
          role: p ? "button" : void 0,
          tabIndex: p ? 0 : -1,
          "aria-label": p ? "Tap to open the gift" : void 0,
          className: `relative h-full w-full select-none overflow-hidden outline-none ${p ? "cursor-pointer" : "cursor-default"}`,
          style: { background: e.bg },
          onClick: E,
          onKeyDown: (e) => ("Enter" === e.key || " " === e.key) && E(),
          children: [
            (0, a.jsx)(i.f.div, {
              "aria-hidden": !0,
              className: "pointer-events-none absolute inset-0",
              style: { background: e.darkBg, zIndex: 0 },
              initial: { opacity: 1 },
              animate: { opacity: +!A },
              transition: { duration: 2.4, ease: "easeInOut" },
            }),
            (0, a.jsx)(i.f.div, {
              "aria-hidden": !0,
              className: "pointer-events-none absolute inset-0",
              style: {
                background: `radial-gradient(ellipse 58% 46% at 50% 46%, ${e.glow} 0%, transparent 70%)`,
                zIndex: 0,
              },
              initial: { opacity: 0 },
              animate: { opacity: 0.32 * !A },
              transition: { duration: 1, ease: "easeInOut" },
            }),
            (0, a.jsx)(i.f.div, {
              "aria-hidden": !0,
              className: "pointer-events-none absolute inset-0",
              style: {
                background: `radial-gradient(ellipse 74% 58% at 50% 46%, ${e.glow} 0%, transparent 60%)`,
                zIndex: 0,
              },
              initial: { opacity: 0, scale: 0.7 },
              animate: A
                ? $
                  ? { opacity: 0, scale: 1 }
                  : { opacity: [0.4, 0.55, 0], scale: [1, 1.4, 1.7] }
                : W("peak")
                  ? $
                    ? { opacity: 0.55, scale: 1 }
                    : { opacity: [0, 0.95, 0.4], scale: [0.5, 1.4, 1.1] }
                  : { opacity: 0, scale: 0.6 },
              transition: A
                ? $
                  ? { duration: 0.8 }
                  : { duration: 1.8, ease: "easeOut", times: [0, 0.4, 1] }
                : $
                  ? { duration: 0.6 }
                  : { duration: 1.1, ease: o.L.enter, times: [0, 0.4, 1] },
            }),
            (0, a.jsx)(i.f.div, {
              "aria-hidden": !0,
              className: "pointer-events-none absolute inset-x-0 bottom-0",
              style: {
                height: "30%",
                background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.34) 120%)",
                zIndex: 0,
              },
              initial: { opacity: 1 },
              animate: { opacity: +!A },
              transition: { duration: 1, ease: "easeInOut" },
            }),
            v.map((e, t) => {
              var i, n, o;
              let r, l, c, u;
              return (0, a.jsx)(
                d,
                {
                  flower: e,
                  tier: g,
                  grown: C,
                  falling: A,
                  swaying: B,
                  reduced: m,
                  lean:
                    I && !m
                      ? ((i = e),
                        (n = w / 2),
                        (o = 0.47 * b),
                        (r = n - i.hx),
                        (u = Math.min(34, 0.08 * (c = Math.hypot(r, (l = o - i.hy)) || 1))),
                        {
                          x: s((r / c) * u),
                          y: s((l / c) * u),
                          rotate: s(Math.sign(r) * Math.min(12, 0.025 * Math.abs(r))),
                        })
                      : null,
                },
                `fl-${t}`,
              );
            }),
            D.map((e, t) =>
              (0, a.jsx)(
                "div",
                {
                  "aria-hidden": !0,
                  className: "pointer-events-none absolute",
                  style: {
                    left: "50%",
                    top: "47%",
                    width: `${e.size}vw`,
                    transform: "translate(-50%,-50%)",
                    zIndex: e.z,
                  },
                  children: (0, a.jsx)(i.f.img, {
                    src: e.src,
                    alt: "",
                    draggable: !1,
                    style: { width: "100%", height: "auto", display: "block" },
                    initial: { x: 0, y: 0, scale: 0, opacity: 0 },
                    animate: C
                      ? A
                        ? {
                            x: e.fx * w * 1.5,
                            y: e.fy * b * 1.5,
                            scale: 0.45,
                            rotate: e.rot + e.driftRot,
                            opacity: 0,
                          }
                        : {
                            x: e.fx * w,
                            y: e.fy * b,
                            scale: [0.3, 1, 0.92],
                            rotate: e.rot,
                            opacity: [0, e.op, e.op],
                          }
                      : { x: 0, y: 0, scale: 0, opacity: 0 },
                    transition: A
                      ? { duration: 1.6, ease: o.L.settle, delay: e.fallDelay }
                      : { duration: 0.8 + 0.4 * (0, o.r)(t, 5), ease: o.L.drift, delay: e.delay },
                  }),
                },
                `pt-${t}`,
              ),
            ),
            !m &&
              !$ &&
              W("peak") &&
              !A &&
              j.map((t, n) =>
                (0, a.jsx)(
                  i.f.div,
                  {
                    "aria-hidden": !0,
                    className: "pointer-events-none absolute rounded-full",
                    style: {
                      left: `${t.left}%`,
                      bottom: "14%",
                      width: `${t.size}px`,
                      height: `${t.size}px`,
                      background: `radial-gradient(circle, ${e.glow} 0%, transparent 70%)`,
                      zIndex: 11,
                    },
                    initial: { opacity: 0, y: 0, x: 0 },
                    animate: {
                      opacity: [0, t.op, 0],
                      y: [0, -(t.rise / 100) * b],
                      x: [0, (t.drift / 100) * w],
                    },
                    transition: {
                      duration: t.dur,
                      ease: "easeOut",
                      delay: t.delay,
                      repeat: 1 / 0,
                      repeatDelay: t.gap,
                    },
                  },
                  `mote-${n}`,
                ),
              ),
          ],
        });
      },
    ]);
  },
  15905,
  function (e) {
    e.n(e.i(33066));
  },
]);
