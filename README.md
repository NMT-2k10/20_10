# Flower Garden – bản web trên máy để custom

Giữ nguyên nội dung, hình ảnh, phông chữ và bộ hiệu ứng phía trình duyệt của trang mẫu:
https://graden-flowers--flowers-2d5e3.asia-southeast1.hosted.app/?isPreview=true&autoplay=0&muted=1

## Mở web

Nhấp đúp **MO-WEB.cmd**. Web mở trong trình duyệt mặc định khi server sẵn sàng.
Hoặc mở Terminal trong thư mục này, chạy `npm start`, rồi truy cập **http://127.0.0.1:5178**.
Giữ cửa sổ lệnh mở trong khi xem. Nhấn Ctrl+C để tắt server.

Không cần `npm install`. Chỉ cần Node.js, đã có trên máy tại thời điểm tạo.
Ảnh, font, nhạc, CSS và JavaScript dùng cho bản màu hồng này đều đã lưu trong thư mục. Server không chuyển tiếp sang website mẫu khi thiếu file.

## Mở code

Mở **Flower-Garden.code-workspace** bằng VS Code, hoặc chọn File → Open Folder → thư mục này.

| File / thư mục | Sửa gì ở đây |
| --- | --- |
| `gift.json` | Lời chào, tên người nhận, chữ ký, lời chúc, nội dung thư, đường dẫn ảnh và nhạc |
| `image/`, `public/image/` | 38 ảnh cá nhân; bản phục vụ web nằm trong `public/image/`, đường dẫn được cấu hình trong `gift.json` |
| `public/music/` | `intro.m4a` mở đầu, `loop.m4a` nhạc nền |
| `public/growing-garden/pink/` | Hình bông hoa, cánh hoa |
| `public/gift/flowers/` | Hình lá trang trí |
| `custom.css` | CSS riêng để đổi giao diện; hiện để trống |
| `src/page.mjs` | Khung HTML và cách đưa nội dung `gift.json` vào trang |
| `public/bootstrap.js` | Khởi chạy component với nội dung của bạn |
| `src/gift-experience.js` | Code đã format: các màn quà, bó hoa, thư và chuyển cảnh |
| `src/growing-garden.js` | Code đã format của vườn hoa |
| `src/styles.css` | CSS gốc đã format |
| `public/_next/static/chunks/` | Bản build gốc và các thư viện; bản gốc được giữ để tham khảo |
| `server.mjs` | Server cục bộ chỉ lắng nghe tại 127.0.0.1 |

Sau khi sửa `gift.json`, ảnh, CSS, `src/gift-experience.js` hoặc `src/growing-garden.js`, lưu file rồi nhấn Ctrl+R. Sau khi sửa code server/khung trang, tắt và chạy lại server.
JSON phải có dấu ngoặc kép và không có dấu phẩy thừa ở cuối danh sách.

## Âm thanh

Nhạc bắt đầu khi bấm **Chạm để mở quà**: phát `public/music/intro.m4a` một lần rồi lặp `public/music/loop.m4a`. Nút góc trên bên phải dùng để bật/tắt nhạc. Khi mở thư, âm lượng tự giảm.

Phần phát nhạc nằm trong `public/gift-audio.js`, dùng trình phát âm thanh của trình duyệt. Nếu trình duyệt chặn phát, bấm **Bấm để bật nhạc 🎵**. Có thể thay hai file nhạc hoặc sửa đường dẫn `music` trong `gift.json`.

Sau khi cập nhật bản sửa âm thanh, đóng cửa sổ chạy web cũ, mở lại `MO-WEB.cmd` rồi nhấn **Ctrl+F5** trên trang.

## Bản build tĩnh

Chạy `npm run build` để xuất toàn bộ trang vào `dist/`. Khi chỉnh nội dung, chạy lại lệnh để cập nhật bản xuất.
Bản này dùng đường dẫn từ gốc `/`, phù hợp phục vụ qua HTTP ở gốc tên miền. Không mở `dist/index.html` trực tiếp bằng `file://`.

## Mã nguồn lấy được

Đây là **mã JavaScript/CSS công khai đã biên dịch của trang**, cùng một bộ khởi chạy cục bộ và cấu hình dễ sửa. Không phải repository React/Next.js nguyên bản trước khi biên dịch; tên biến trong các file gốc đã được rút gọn. Có thể mở, format và chỉnh các file JavaScript đó bằng VS Code.

Không có backend hay tài khoản quản trị của website gốc. `gift.json` và `custom.css` là các chỗ thuận tiện nhất để bắt đầu custom. Các bảng màu khác còn được nhắc trong code gốc nhưng chỉ tài nguyên của bảng màu hồng hiện tại được tải về.

Nguồn mẫu và tài nguyên: **lovegift.online**. Các file thư viện giữ nguyên thông tin bản quyền có sẵn trong build. `tools/download-assets.mjs` chỉ dùng để khôi phục file bị thiếu, không cần chạy để sử dụng bản hiện tại.

## Nâng cấp hình ảnh

Bản này bổ sung hoa và lá ở màn mở đầu, ánh sáng dịu, bóng hoa nhiều lớp, gân lá và vệt sáng trên thân, nếp giấy kraft và nơ satin. Nền sáng dùng màu kem/hồng nhẹ; hoa rơi được giảm để bó hoa rõ hơn. Các lớp trang trí không chặn thao tác; trang trí mới tôn trọng cài đặt giảm chuyển động.

- `custom.css`: ánh sáng, màu sắc, bố cục hoa trang trí và bóng đổ.
- `public/gift/details/`: hạt giấy và nếp gấp dạng SVG.
- `ART-DIRECTION.md`: prompt và tên file để đổi bộ hoa màu nước sang hoa giống ảnh chụp.

Chạy lại server sau khi cập nhật `server.mjs`, rồi nhấn **Ctrl+F5**. Server dùng phản hồi có độ dài rõ ràng để tránh lỗi đọc luồng file lặp lại trên môi trường ổ đĩa Windows được gắn vào Linux. `npm run build` cập nhật bản tĩnh trong `dist/`.

Chi tiết bó hoa được vẽ bằng SVG trong `public/gift/details/`: `tissue-layers.svg` (giấy lụa), `wrap-details.svg` (vân sợi, mép giấy và hoa văn), `satin-ribbon.svg` (nơ và đuôi ruy băng), `tag-sprig.svg` (hoa văn thiệp). Chữ trên thiệp vẫn lấy từ `bouquet.tag` trong `gift.json`; dây treo và lỗ xỏ nằm trong `src/gift-experience.js` và `custom.css`.

## Ngân hà ảnh sau màn kết thúc

Nút **Tiếp tục** mở màn ngân hà 3D ngay trong web, dựa theo trang mẫu `love-galaxy-pro.netlify.app`. Giữ chuột trái rồi kéo để xoay 360°; trên điện thoại vuốt để xoay, lăn chuột/chụm hai ngón để phóng to hoặc thu nhỏ. Bấm trực tiếp vào ảnh để xem lớn; dùng nút trước/sau để chuyển ảnh, hoặc bấm **Ảnh** để mở bộ ảnh. **Quay lại** trở về màn kết thúc.

Bấm trái tim hoặc quả cầu sáng ở giữa để chạy **cinematic intro**: camera đi qua lõi sáng, bay vòng quanh tim, lùi ra toàn cảnh, hạ xuống xoắn ốc và bay xuyên ngân hà. Bấm chuột/chạm, lăn chuột hoặc phím Escape dừng hiệu ứng để tự điều khiển. Bấm lại trái tim hoặc quả cầu sáng để chạy lại chuỗi.

Màn ngân hà không có thư hay bảng hướng dẫn. Phần thư trong trải nghiệm quà ban đầu vẫn giữ nguyên. Nhạc dùng chung với trang chính. Ảnh lấy từ `chapters[].photos`; có thể cấu hình riêng bằng `galaxy.title`, `galaxy.messages`, `galaxy.photos` trong `gift.json`. Mã và thư viện/font cục bộ nằm trong `public/galaxy/`, không cần kết nối tới trang mẫu để chạy. Chi tiết trong `public/galaxy/README.md`.

Góc nhìn mặc định nằm trong vòng ảnh, thấp gần mặt phẳng ảnh. Nút đặt lại góc nhìn trở về đúng vị trí này; nút Cinematic riêng đã được bỏ.


Giữ chuột trái rồi kéo để xoay camera; di chuột thông thường không đổi góc nhìn. Ảnh trôi quanh ngân hà với tốc độ 0,05 radian/giây, gấp 2 lần bản trước. Bật giảm chuyển động vẫn tắt phần trôi tự động.

Ảnh cá nhân đã thay từ `image/`: ảnh bông hoa đầu và màn vườn dùng `94996287630f4b50858c33b27a274f93.webp`, ảnh thư và tem dùng `IMG_20260911_182245_859_edit_10790.jpg`, ảnh kết thúc dùng `595a6e254ae7418b9e312938f1314b4a.webp`. Các bông hoa còn lại dùng ảnh được chọn ngẫu nhiên, lưu cố định trong `chapters`. `galaxy.photos` chứa toàn bộ 38 ảnh trong thư mục.

Nhạc riêng cho galaxy đặt tại `music.galaxy` trong `gift.json`. Khi bấm Tiếp tục, trình phát dừng nhạc quà và phát lặp bài MP3; khi Quay lại, nhạc quà tiếp tục từ vị trí đã dừng. Nút bật/tắt nhạc dùng chung cho cả hai phần.

Website: https://nmt-2k10.github.io/20_10/

Đẩy thay đổi lên nhánh `main` để GitHub Actions tự build và cập nhật GitHub Pages. Bản build dùng `npm run build -- --base=/20_10/`; chạy local vẫn dùng `npm start` với đường dẫn gốc.
