// Các đường dẫn đã quan sát từ trang mẫu công khai ngày 16/10/2026.
// Đây là build phía trình duyệt, không phải repository React/Next.js gốc.
export const origin = 'https://graden-flowers--flowers-2d5e3.asia-southeast1.hosted.app';
export const css = '/_next/static/chunks/0u_4a172hft8a.css';
export const chunks = [
  '0fi453dere7a3.js', '3dmm3v_fq28gc.js', 'turbopack-3-ry682tkyiqk.js',
  '42onvq6nokjl2.js', '2bperlg_6o-6r.js', '23fhpocut8mds.js', '2-2b8uu-cdslt.js'
];
export const fonts = [
  '1FTVVIPBritishGreen_Italic-s.p.0k_sgci_o2ctk.ttf',
  '1FTV_VIP_Gillastone-s.p.03_dd09s_l-8c.otf',
  '3c285486269019b7-s.p.2g-0we2o5_ngd.woff2',
  '53e45098eac42afb-s.p.1uklb5el4zgvl.woff2',
  '625a092f804baad3-s.p.1zvg0ggiaivzo.woff2',
  '8f46d218c8f79e34-s.p.2wu4yy186g04j.woff2',
  'a3bcb02a0e9e5d11-s.p.25pbmqxk8u2s7.woff2',
  'a4f4f75ad654963f-s.p.1hvvd1t-trplq.woff2',
  '6afabefbb32d7517-s.0jaqhc1tb-5xm.woff2'
];
export const flowers = [
  'bloom-cream-daisy-head-md-02.webp', 'bloom-cream-daisy-head-md-03.webp',
  'bloom-soft-pink-zinnia-head-md-02.webp', 'bloom-pale-pink-lily-head-lg-01.webp',
  'bloom-pale-pink-lily-head-lg-02.webp', 'bloom-white-hibiscus-head-lg-01.webp',
  'bloom-peach-cosmos-head-md-02.webp', 'bloom-pink-clematis-head-md-01.webp',
  'bloom-pink-daisy-head-md-01.webp', 'petal-muted-rose-long-01.webp',
  'petal-coral-curved-01.webp', 'petal-blush-broad-02.webp', 'petal-cream-pink-blush-01.webp'
];
export const knownAssets = [css,
  ...chunks.map(x => '/_next/static/chunks/' + x),
  '/_next/static/chunks/19wg2q9r2_sev.js', '/_next/static/chunks/177n6j0ku_8k2.js',
  '/_next/static/chunks/0cz1d0mv5g_q7.js',
  ...fonts.map(x => '/_next/static/media/' + x),
  ...flowers.map(x => '/growing-garden/pink/' + x),
  ...Array.from({length:12}, (_, i) => `/gift/photos/p${String(i+1).padStart(2,'0')}.jpg`),
  '/gift/flowers/foliage-wide.webp', '/music/intro.m4a', '/music/loop.m4a'
];
