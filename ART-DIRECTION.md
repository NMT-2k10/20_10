# Ảnh bổ sung nếu muốn hoa giống ảnh chụp

Bản nâng cấp dùng được ngay với các ảnh màu nước có sẵn. Để chuyển sang cảm giác hoa thật, tạo **từng ảnh riêng**, xuất PNG/WebP có nền trong suốt thật (alpha), không nền ô caro vẽ sẵn. Không cần tạo ảnh nguyên bó hoa: web tự ghép và chuyển động từng bông.

## Prompt chung cho đầu bông hoa

Thay phần trong ngoặc vuông cho mỗi loại bên dưới:

> A single [FLOWER], flower head only, no stem, no leaves, isolated on a truly transparent background. Photorealistic botanical macro photography, delicate translucent petals, natural irregular petal edges, fine veins, subtle imperfect asymmetry, soft diffuse daylight from the upper left, neutral warm white balance, restrained blush pink and ivory palette, crisp natural detail, no harsh shadows, no cast shadow outside the object, no text, no border. Mostly front-facing with a subtle 10-degree tilt, entire flower visible, centered with 10 percent transparent padding, square 1024 by 1024 image. Not an illustration, not plastic, not a 3D render.

| Tạo ảnh | Thay `[FLOWER]` | File hiện có để thay (trong `public/growing-garden/pink/`) |
| --- | --- | --- |
| Cúc kem 1 | ivory cream daisy with a small warm golden center | `bloom-cream-daisy-head-md-02.webp` |
| Cúc kem 2 | ivory cream daisy, slightly different petal arrangement | `bloom-cream-daisy-head-md-03.webp` |
| Hoa hồng phấn nhiều cánh | pale blush pink zinnia with layered petals | `bloom-soft-pink-zinnia-head-md-02.webp` |
| Cosmos | soft peach pink cosmos with delicate broad petals | `bloom-peach-cosmos-head-md-02.webp` |
| Cúc hồng | dusty pink daisy with a golden center | `bloom-pink-daisy-head-md-01.webp` |
| Lily 1 và 2, tạo riêng | pale pink lily, visible stamens, natural botanical form | `bloom-pale-pink-lily-head-lg-01.webp`, `bloom-pale-pink-lily-head-lg-02.webp` |
| Clematis | muted rose pink clematis | `bloom-pink-clematis-head-md-01.webp` |
| Dâm bụt trắng | ivory white hibiscus with a delicate pale pink center | `bloom-white-hibiscus-head-lg-01.webp` |

Nên tạo cả bộ cùng phiên/mô hình để ánh sáng và màu sắc thống nhất. Đổi tên file không đổi định dạng: cần xuất/chuyển mã sang WebP thật nếu dùng tên `.webp`. Sao lưu ảnh cũ trước khi thay.

## Lá và hoa nhỏ

Tạo hai ảnh riêng theo prompt này, một dáng xoè ngang, một dáng vươn cao:

> A single airy florist foliage spray of sage green eucalyptus, slender olive leaves and tiny ivory baby's breath flowers. Photorealistic botanical photography, soft diffuse daylight from the upper left, muted natural greens, fine leaf veins, organic asymmetry. Truly transparent background, entire spray visible, no vase, no hands, no ribbon, no wrapping, no text, no external cast shadow. Stems converge at the bottom center so the spray can be layered behind a bouquet. [Wide fan-shaped / Tall upright] arrangement, 1024 by 1024, 10 percent transparent padding.

Thay `public/gift/flowers/foliage-wide.webp` và `foliage-upright.webp`. Hai ảnh này cũng trang trí màn mở đầu.

## Cánh hoa rời

Nếu thay toàn bộ sang ảnh chụp, tạo thêm 4 cánh hoa riêng (hồng phấn, hồng bụi, kem hồng, san hô nhạt), dùng ánh sáng tương tự. Nền trong suốt, không bóng đổ ra ngoài vật thể, cánh hơi cong có gân, nhìn nghiêng nhẹ. Thay 4 file `petal-*.webp` trong `public/growing-garden/pink/`.

Chỉ cần gửi các file đã tạo lại để mình căn kích thước, khoảng trống và màu cho phù hợp bố cục. Chưa cần thêm ảnh cá nhân hay nhạc để xem bản nâng cấp này.
