

// export interface BlogPost {
//     id: string;
//     slug: string;
//     title: string;
//     description: string; // Đoạn mô tả ngắn hiện ở thẻ
//     date: string;
//     thumbnail: string;
//     content: string; // Nội dung HTML chi tiết của bài viết
// }

// export const BLOG_DATA: BlogPost[] = [
//     {
//         id: "1",
//         slug: "top-5-chai-xit-nano-bao-ve-giay-giup-ban-tha-ho-di-mau",
//         title: "Top 5 chai xịt nano bảo vệ giày giúp bạn tha hồ đi mưa",
//         date: "27/09/2022",
//         description: "Giày dép là một phần không thể thiếu trong tủ đồ của mỗi người. Đặc biệt, những đôi giày yêu thích không chỉ...",
//         thumbnail: "https://naidecor.vn/wp-content/uploads/2020/08/BST-GD-02.jpg",
//         content: `
//       <p>Mùa mưa đến là nỗi ám ảnh của những tín đồ sneaker. Nước mưa, bùn đất không chỉ làm bẩn mà còn gây hư hỏng, bong tróc keo giày. Giải pháp cứu cánh chính là <strong>chai xịt Nano chống thấm</strong>.</p>

//       <h3>1. Crep Protect Spray</h3>
//       <p>Đây được xem là "ông vua" trong làng xịt nano. Crep Protect tạo ra một lớp phủ vô hình có khả năng chống thấm nước và vết bẩn cực tốt. Chỉ cần xịt 2 lớp, bạn có thể yên tâm đi mưa nhỏ mà không lo ướt giày.</p>

//       <h3>2. Jason Markk Repel</h3>
//       <p>Sản phẩm đến từ thương hiệu vệ sinh giày nổi tiếng. Jason Markk Repel có gốc nước, an toàn cho mọi chất liệu từ da lộn, nubuck đến vải canvas. Điểm cộng là đầu xịt phun sương rất mịn.</p>

//       <h3>3. Sneaker Lab Sneaker Protector</h3>
//       <p>Sử dụng công nghệ sinh học thân thiện với môi trường. Loại xịt này không chỉ chống nước mà còn giúp giữ màu giày luôn mới.</p>

//       <p><strong>Lưu ý khi sử dụng:</strong> Hãy vệ sinh giày sạch sẽ và để khô hoàn toàn trước khi xịt nano để đạt hiệu quả tốt nhất.</p>
//     `
//     },
//     {
//         id: "2",
//         slug: "cach-do-chan-de-chon-size-giay",
//         title: "Cách Đo Chân Để Chọn Size Giày Cho Chuẩn",
//         date: "27/09/2022",
//         description: "Có bao giờ bạn băn khoăn về việc mua giày online nhưng không chắc chắn đôi chân mình...",
//         thumbnail: "https://www.elle.vn/app/uploads/2019/06/12/giay-sneakers-mau-do-den-truoc-anh-mat-troi-2.jpg",
//         content: `
//       <p>Mua giày online tiện lợi nhưng rủi ro chọn sai size rất cao. Hãy làm theo các bước sau để đo chân chính xác nhất tại nhà:</p>

//       <h3>Bước 1: Chuẩn bị dụng cụ</h3>
//       <ul>
//         <li>Một tờ giấy trắng (lớn hơn bàn chân).</li>
//         <li>Một cây bút chì.</li>
//         <li>Một cây thước kẻ.</li>
//       </ul>

//       <h3>Bước 2: Vẽ khung bàn chân</h3>
//       <p>Đặt tờ giấy xuống sàn nhà phẳng. Đặt bàn chân lên giấy, giữ chân cố định. Dùng bút chì vẽ dọc theo đường viền bàn chân. Lưu ý đặt bút thẳng đứng vuông góc với giấy để số đo chính xác.</p>

//       <h3>Bước 3: Đo chiều dài và chiều rộng</h3>
//       <p>Dùng thước kẻ đo điểm dài nhất (từ gót đến ngón chân dài nhất) và điểm rộng nhất của bàn chân. Ghi lại số liệu.</p>

//       <h3>Bước 4: Đối chiếu bảng size</h3>
//       <p>Lấy chiều dài chân + 1.5cm (trừ hao vớ) rồi đối chiếu với bảng size của hãng giày bạn định mua (Nike, Adidas, MLB thường có bảng size khác nhau).</p>
//     `
//     },
//     {
//         id: "3",
//         slug: "13-cach-bao-quan-giay-toan-dien-co-the-ban-chua-biet",
//         title: "13 cách bảo quản giày toàn diện có thể bạn chưa biết",
//         date: "27/09/2022",
//         description: "Nhiều bạn quan niệm rằng những đôi sneaker khỏe khoắn có thể làm mất đi nét nữ tính và...",
//         thumbnail: "https://www.chapi.vn/img/article/2017/8/28/6-mau-sneakers-chua-bao-gio-loi-thoi-new.jpg",
//         content: `
//       <p>Giày sneaker nếu không bảo quản đúng cách sẽ rất nhanh xuống cấp, ố vàng đế hoặc bị mốc. Dưới đây là những mẹo nhỏ nhưng có võ:</p>

//       <h3>1. Sử dụng Shoe Trees (Cây giữ form)</h3>
//       <p>Đây là vật dụng bắt buộc phải có. Shoe trees giúp giày không bị gãy mũi (crease) và hút ẩm bên trong giày sau khi mang.</p>

//       <h3>2. Không phơi giày dưới nắng gắt</h3>
//       <p>Nắng gắt sẽ làm keo giày bị bung và chất liệu da bị nổ. Hãy phơi giày ở nơi thoáng mát, có gió tự nhiên.</p>

//       <h3>3. Sử dụng phấn rôm trẻ em</h3>
//       <p>Nếu giày có mùi hôi hoặc bị ẩm, hãy rắc một ít phấn rôm vào bên trong và để qua đêm. Phấn rôm hút ẩm và khử mùi cực tốt.</p>

//       <p>...</p>
//     `
//     },
//     {
//         id: "4",
//         slug: "5-meo-bao-quan-giay-bang-nilon-chong-nuoc-chong-nham-chong-moc-chong-ri-set",
//         title: "5 mẹo bảo quản giày bằng nilon chống nước, chống nhựa",
//         date: "27/09/2022",
//         description: "Nếu không biết cách bảo quản giày, bạn có thể gặp phải những vấn đề như: giày bị mốc, giày bị rỉ sét...",
//         thumbnail: "https://myshoes.vn/image/catalog/blog/26.11/mau-giay-the-thao-nam.jpeg",
//         content: `
//       <p>Túi nilon, đặc biệt là túi zip, là một công cụ bảo quản giày tuyệt vời cho những đôi giày ít sử dụng (giày sưu tầm).</p>
//       <h3>Cách thực hiện:</h3>
//       <p>Vệ sinh giày sạch sẽ, đảm bảo giày khô hoàn toàn. Cho gói hút ẩm vào trong giày. Đặt giày vào túi nilon/túi zip, ép hết không khí ra ngoài và đóng kín.</p>
//       <p>Phương pháp này giúp cách ly giày khỏi độ ẩm không khí, ngăn chặn quá trình oxy hóa gây ố vàng đế (đế icy).</p>
//     `
//     }
// ];
// src/data/blogData.ts

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
    content: string; // HTML Content
}

export const BLOG_DATA: BlogPost[] = [
    {
        id: "1",
        slug: "top-5-chai-xit-nano-bao-ve-giay-giup-ban-tha-ho-di-mau",
        title: "Top 5 Chai Xịt Nano Bảo Vệ Giày Giúp Bạn Tha Hồ Đi Mưa",
        date: "27/09/2022",
        description: "Giày dép là một phần không thể thiếu trong tủ đồ. Cùng tìm hiểu top 5 chai xịt nano thần thánh giúp bảo vệ giày khỏi nước mưa và bùn đất.",
        thumbnail: "https://naidecor.vn/wp-content/uploads/2020/08/BST-GD-02.jpg",
        content: `
      <p>Mùa mưa luôn là "kẻ thù" số một của những đôi sneaker yêu quý. Nước mưa, bùn đất không chỉ làm bẩn mà còn ngấm vào vải, gây bong tróc keo, ẩm mốc và tạo mùi hôi khó chịu. Vậy làm sao để bảo vệ "chiến hài" của bạn?</p>
      <p>Giải pháp hiệu quả và tiết kiệm nhất chính là sử dụng <strong>chai xịt Nano chống thấm</strong>. Hãy cùng Shoe Store điểm qua danh sách Top 5 sản phẩm tốt nhất hiện nay nhé.</p>

      <div class="toc">
        <h4>Nội dung bài viết</h4>
        <ul>
          <li><a href="#section-1">1. Xịt Nano là gì? Cơ chế hoạt động</a></li>
          <li><a href="#section-2">2. Top 5 chai xịt Nano tốt nhất 2025</a></li>
          <li><a href="#section-3">3. Hướng dẫn sử dụng xịt Nano đúng cách</a></li>
          <li><a href="#section-4">4. Những lưu ý quan trọng</a></li>
        </ul>
      </div>

      <h2 id="section-1">1. Xịt Nano là gì? Cơ chế hoạt động</h2>
      <p>Chai xịt Nano (Nano Protector) là dung dịch chứa các hạt nano siêu nhỏ. Khi xịt lên bề mặt giày, các hạt này sẽ liên kết với nhau tạo thành một màng chắn trong suốt vô hình.</p>
      <p>Lớp màng này có hiệu ứng "lá sen", khiến nước và chất lỏng khi rơi vào giày sẽ trượt đi ngay lập tức thay vì thấm vào vải. Công nghệ này không chỉ chống nước mà còn chống bụi bẩn cực kỳ hiệu quả.</p>
      
      <img src="https://heramo.com/blog/wp-content/uploads/2024/02/chai-xit-nano-giay-1.jpg" alt="Hiệu ứng lá sen trên giày" />
      <p style="text-align:center; font-style:italic; font-size:14px; color:#666;">Hiệu ứng chống nước tuyệt vời nhờ công nghệ Nano</p>

      <h2 id="section-2">2. Top 5 chai xịt Nano tốt nhất 2025</h2>
      
      <h3>2.1. Crep Protect Spray (Mỹ)</h3>
      <p>Không cần bàn cãi, <strong>Crep Protect</strong> được mệnh danh là "ông vua" trong làng vệ sinh giày. Sản phẩm này nổi tiếng với khả năng tạo lớp phủ cực bền, có thể kéo dài đến 2 tuần.</p>
      <ul>
        <li><strong>Ưu điểm:</strong> Chống nước tuyệt đối, khô nhanh (khoảng 10 phút), không làm đổi màu giày.</li>
        <li><strong>Nhược điểm:</strong> Giá thành khá cao so với mặt bằng chung.</li>
      </ul>

      <h3>2.2. Jason Markk Repel</h3>
      <p>Jason Markk là thương hiệu cao cấp chuyên dụng cho sneaker. Dòng xịt Repel của hãng có thiết kế đầu phun sương cải tiến, giúp dung dịch phủ đều hơn.</p>
      <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQRZlxzrwq_krLCJUIjc5x61ysYT_1F9FKt4C9FSUInTZ4T5cLCR0CAaogi0-mRrJFOETobcxIgTHakO2JCTFA4feZNuv9txhYXRq-tWeQ88Rpk5-0L82lIpQ" alt="Chai xịt Jason Markk" />

      <h3>2.3. Sneaker Lab Sneaker Protector</h3>
      <p>Sản phẩm này sử dụng công nghệ sinh học, thân thiện với môi trường và an toàn cho da tay. Nếu nhà bạn có trẻ nhỏ hoặc thú cưng, đây là lựa chọn số 1.</p>

      <h2 id="section-3">3. Hướng dẫn sử dụng xịt Nano đúng cách</h2>
      <p>Để đạt hiệu quả tối đa, bạn cần tuân thủ quy trình 3 bước sau:</p>
      <ul>
        <li><strong>Bước 1:</strong> Vệ sinh giày thật sạch và để khô hoàn toàn. Bụi bẩn sẽ làm giảm độ bám của lớp nano.</li>
        <li><strong>Bước 2:</strong> Lắc đều chai xịt. Giữ chai cách giày khoảng 20cm và xịt đều tay một lớp mỏng.</li>
        <li><strong>Bước 3:</strong> Để khô tự nhiên trong 15 phút. Sau đó xịt tiếp lớp thứ 2 và để khô thêm 15-30 phút trước khi mang ra ngoài.</li>
      </ul>

      <h2 id="section-4">4. Những lưu ý quan trọng</h2>
      <p>Không nên lạm dụng xịt quá dày một lúc sẽ dễ gây vệt trắng. Ngoài ra, lớp nano không tồn tại vĩnh viễn, bạn nên xịt lại sau mỗi 2-3 tuần sử dụng thường xuyên để duy trì khả năng bảo vệ.</p>
    `
    },
    {
        id: "2",
        slug: "cach-do-chan-de-chon-size-giay",
        title: "Cách Đo Chân Để Chọn Size Giày Chuẩn Xác Nhất Tại Nhà",
        date: "27/09/2022",
        description: "Mua giày online sợ nhất là không vừa size. Bài viết này sẽ hướng dẫn bạn cách đo chân và bảng quy đổi size chuẩn của Nike, Adidas, MLB.",
        thumbnail: "https://www.elle.vn/app/uploads/2019/06/12/giay-sneakers-mau-do-den-truoc-anh-mat-troi-2.jpg",
        content: `
      <p>Mua sắm online ngày càng phổ biến, nhưng nỗi lo lớn nhất của các tín đồ giày là <strong>chọn sai size</strong>. Giày chật thì đau chân, giày rộng thì nhấc gót. Đừng lo, chỉ cần 5 phút với những dụng cụ đơn giản, bạn sẽ biết chính xác size giày của mình.</p>

      <div class="toc">
        <h4>Nội dung bài viết</h4>
        <ul>
          <li><a href="#b1">1. Dụng cụ cần chuẩn bị</a></li>
          <li><a href="#b2">2. Quy trình 4 bước đo chân chuẩn</a></li>
          <li><a href="#b3">3. Bảng quy đổi size giày (Nike, Adidas, MLB)</a></li>
          <li><a href="#b4">4. Mẹo chọn size khi chân bè/dày</a></li>
        </ul>
      </div>

      <h2 id="b1">1. Dụng cụ cần chuẩn bị</h2>
      <p>Bạn hãy tìm quanh nhà những vật dụng sau nhé:</p>
      <ul>
        <li>Một tờ giấy trắng (khổ A4 hoặc to hơn bàn chân).</li>
        <li>Một cây bút chì (hoặc bút bi).</li>
        <li>Một cây thước kẻ (có chia vạch cm).</li>
        <li>Một đôi tất (vớ) mà bạn dự định sẽ mang cùng giày.</li>
      </ul>

      <h2 id="b2">2. Quy trình 4 bước đo chân chuẩn</h2>
      
      <h3>Bước 1: Cố định vị trí</h3>
      <p>Đặt tờ giấy sát vào cạnh tường. Đứng lên tờ giấy sao cho gót chân chạm nhẹ vào tường. Giữ chân thẳng và cố định.</p>
      
      <img src="https://cdn.storims.com/api/v2/image/resize?path=https://storage.googleapis.com/storims_cdn/storims/uploads/2884eff0f7d1937ea45628e61cc15e54.jpg" alt="Đặt chân lên giấy" />

      <h3>Bước 2: Vẽ khung bàn chân</h3>
      <p>Dùng bút vẽ dọc theo hình dạng bàn chân. <strong>Lưu ý quan trọng:</strong> Luôn giữ cây bút thẳng đứng, vuông góc với mặt giấy. Không nghiêng bút vào trong hoặc ra ngoài vì sẽ làm sai lệch kích thước.</p>

      <h3>Bước 3: Xác định chiều dài và rộng</h3>
      <p>Dùng thước kẻ đo khoảng cách dài nhất (từ gót đến ngón chân dài nhất) và khoảng cách rộng nhất (thường là phần ức bàn chân).</p>

      <h3>Bước 4: Tính toán kết quả</h3>
      <p>Công thức tính size giày chuẩn:</p>
      <blockquote style="background:#eee; padding:15px; border-left:4px solid #333; font-style:italic;">
        Chiều dài giày = Chiều dài chân đo được + 1.5cm
      </blockquote>
      <p>Ví dụ: Chân bạn dài 24cm. Bạn nên chọn giày phù hợp cho chân 25.5cm để ngón chân cử động thoải mái.</p>

      <h2 id="b3">3. Bảng quy đổi size giày</h2>
      <p>Mỗi hãng sẽ có form giày khác nhau. Dưới đây là bảng size tham khảo:</p>
      <ul>
        <li><strong>Nike:</strong> Form thường ôm, nên true-to-size hoặc up 0.5 size.</li>
        <li><strong>Adidas:</strong> Form rộng rãi hơn, thường true-to-size.</li>
        <li><strong>MLB:</strong> Form Chunky thường khá dày, nên up 0.5 - 1 size so với bình thường.</li>
      </ul>

      <h2 id="b4">4. Mẹo chọn size khi chân bè/dày</h2>
      <p>Nếu bạn có bàn chân bè ngang hoặc mu bàn chân dày, hãy luôn <strong>cộng thêm 0.5 đến 1 size</strong> so với chiều dài đo được. Điều này giúp chân không bị bó chặt ở hai bên, tránh gây đau nhức khi di chuyển lâu.</p>
    `
    },
    {
        id: "5",
        slug: "5-cach-giat-giay-trang-bi-o-vang",
        title: "5 Cách Giặt Giày Trắng Bị Ố Vàng Trắng Sáng Như Mới Tại Nhà",
        date: "28/09/2022",
        description: "Giày trắng đi lâu ngày bị ố vàng khiến bạn mất tự tin? Đừng vội vứt đi, hãy thử ngay 5 mẹo giặt giày trắng cực đơn giản với nguyên liệu có sẵn trong bếp.",
        thumbnail: "https://cdn.chiaki.vn/unsafe/0x800/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/news/2024/10/15-cach-giat-giay-trang-khong-bi-o-vang-don-gian-hieu-qua-tai-nha-10102024174940.jpg",
        content: `
      <p>Giày sneaker trắng là item "must-have" (phải có) vì sự tiện dụng và thời trang. Tuy nhiên, nhược điểm lớn nhất là chúng rất dễ bám bẩn và bị ố vàng sau một thời gian sử dụng. Thay vì tốn tiền mang ra tiệm spa, bạn hoàn toàn có thể "hồi sinh" đôi giày của mình tại nhà.</p>

      <div class="toc">
        <h4>Nội dung bài viết</h4>
        <ul>
          <li><a href="#c1">1. Dùng kem đánh răng</a></li>
          <li><a href="#c2">2. Baking Soda và Giấm</a></li>
          <li><a href="#c3">3. Dùng chanh tươi</a></li>
          <li><a href="#c4">4. Dùng dung dịch tẩy sơn móng tay (Aceton)</a></li>
          <li><a href="#c5">5. Lưu ý quan trọng khi phơi giày trắng</a></li>
        </ul>
      </div>

      <h2 id="c1">1. Dùng kem đánh răng</h2>
      <p>Kem đánh răng có chứa chất làm trắng và mài mòn nhẹ, rất hiệu quả để làm sạch đế giày cao su (midsole).</p>
      <ul>
        <li><strong>Cách làm:</strong> Bôi kem đánh răng lên vết bẩn, dùng bàn chải cũ nhúng chút nước rồi chà xoay tròn. Để yên khoảng 10 phút sau đó dùng khăn ướt lau sạch.</li>
      </ul>
      <img src="https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(70)/https://chiaki.vn/upload/news/content/2024/10/cach-lam-sach-giay-trang-bang-kem-danh-rang-jpg-1728557151-10102024174551.jpg" alt="Vệ sinh giày bằng kem đánh răng" />

      <h2 id="c2">2. Baking Soda và Giấm</h2>
      <p>Đây là bộ đôi "thần thánh" trong việc tẩy trắng. Phản ứng sủi bọt giữa Baking Soda và Giấm sẽ đánh bay các vết ố cứng đầu trên vải canvas.</p>
      <ul>
        <li><strong>Tỉ lệ:</strong> Trộn 2 muỗng Baking Soda + 3 muỗng Giấm ăn.</li>
        <li><strong>Thực hiện:</strong> Nhúng bàn chải vào hỗn hợp, chà kỹ lên giày. Để hỗn hợp khô tự nhiên trên giày khoảng 15 phút rồi xả sạch với nước ấm.</li>
      </ul>

      <h2 id="c3">3. Dùng chanh tươi</h2>
      <p>Trong chanh có chứa axit xitric tự nhiên, giúp tẩy trắng nhẹ nhàng mà không làm hỏng vải giày.</p>
      <p>Bạn chỉ cần cắt đôi quả chanh, chà trực tiếp lên vết ố vàng. Để khoảng 15-20 phút rồi giặt lại bằng nước sạch.</p>

      <h2 id="c4">4. Dùng dung dịch tẩy sơn móng tay (Aceton)</h2>
      <p>Mẹo này cực hiệu quả với những vết xước bẩn màu đen trên phần đế cao su hoặc mũi giày da. Thấm một ít Aceton vào bông tẩy trang và lau nhẹ, vết bẩn sẽ biến mất ngay lập tức.</p>

      <h2 id="c5">5. Lưu ý quan trọng khi phơi giày trắng</h2>
      <p>Rất nhiều bạn giặt sạch nhưng phơi xong giày lại bị ố vàng nặng hơn. Lý do là vì cặn xà phòng còn sót lại khi gặp nắng gắt sẽ bị oxy hóa.</p>
      <p><strong>Bí quyết:</strong> Sau khi giặt xong, hãy đắp một lớp <strong>khăn giấy ăn (tissue)</strong> kín bề mặt giày rồi mới đem phơi. Giấy ăn sẽ hút ngược các vết ố vàng ra khỏi vải. Khi giày khô, bạn bóc lớp giấy đi là giày sẽ trắng tinh.</p>
      <img src="https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(70)/https://chiaki.vn/upload/news/content/2024/10/phoi-kho-giay-trang-jpg-1728557112-10102024174512.jpg" alt="Đắp giấy ăn lên giày khi phơi" />
    `
    },
    {
        id: "6",
        slug: "huong-dan-phan-biet-giay-real-va-fake",
        title: "Hướng Dẫn Phân Biệt Giày Real Và Fake Cực Chuẩn Cho Newbie",
        date: "29/09/2022",
        description: "Thị trường giày sneaker thật giả lẫn lộn khiến bạn hoang mang? Bỏ túi ngay những bí kíp check giày Auth - Fake cơ bản nhất để tránh mất tiền oan.",
        thumbnail: "https://giaygiare.vn/upload/sanpham/large/cach-check-giay-jordan-real-fake-chuan-va-chinh-xac-nhat.jpg",
        content: `
      <p>Công nghệ làm giả (Fake/Replica) ngày càng tinh vi khiến việc phân biệt giày chính hãng (Real/Auth) trở nên khó khăn hơn bao giờ hết. Tuy nhiên, hàng chính hãng vẫn luôn có những tiêu chuẩn chất lượng mà hàng nhái khó lòng sao chép 100%.</p>

      <div class="toc">
        <h4>Nội dung bài viết</h4>
        <ul>
          <li><a href="#check1">1. Kiểm tra hộp giày (Box)</a></li>
          <li><a href="#check2">2. Soi đường may (Stitching)</a></li>
          <li><a href="#check3">3. Tem giày (Tag) và Mã code</a></li>
          <li><a href="#check4">4. Mùi keo và cảm giác khi mang</a></li>
        </ul>
      </div>

      <h2 id="check1">1. Kiểm tra hộp giày (Box)</h2>
      <p>Hộp giày Real thường vuông vức, cứng cáp, màu sắc in sắc nét. Tem dán trên hộp (Box Label) có font chữ đều, mã SKU trùng khớp với mã trên giày.</p>
      <p>Hộp giày Fake thường mỏng manh, dễ móp méo, tem in bị nhòe hoặc font chữ dại, sai chính tả.</p>

      <h2 id="check2">2. Soi đường may (Stitching)</h2>
      <p>Đây là yếu tố quan trọng. Các hãng lớn như Nike, Adidas kiểm soát chất lượng rất gắt gao.</p>
      <ul>
        <li><strong>Real:</strong> Đường may đều đặn, khoảng cách giữa các mũi chỉ cân đối, không có chỉ thừa vón cục.</li>
        <li><strong>Fake:</strong> Đường may thường xiêu vẹo, chỗ thưa chỗ dày, thường xuyên xuất hiện chỉ thừa hoặc keo thừa lem nhem ở mép đế.</li>
      </ul>
      <img src="https://thuocthang.com.vn/vnt_upload/File/Image/Kiem_Tra_Duong_May_Cua_Giay.png" alt="So sánh đường may giày Real và Fake" />

      <h2 id="check3">3. Tem giày (Tag) và Mã code</h2>
      <p>Tem bên trong lưỡi gà là nơi chứa nhiều thông tin nhất. Hãy chú ý đến độ nét của chữ, khoảng cách các ký tự.</p>
      <p><strong>Mẹo Check Code:</strong> Gõ dòng mã SKU (ví dụ: CW2288-111 của AF1) lên Google. Nếu là giày Real, kết quả tìm kiếm hình ảnh sẽ trả về đúng đôi giày đó. Nếu không ra kết quả hoặc ra đôi khác, khả năng cao là Fake.</p>

      <h2 id="check4">4. Mùi keo và cảm giác khi mang</h2>
      <p>Giày chính hãng mới thường có mùi đặc trưng của vật liệu mới (da, cao su) nhưng không hắc. Giày Fake thường nồng nặc mùi keo hóa chất rẻ tiền gây khó chịu.</p>
      <p>Khi mang thử, giày Real (đặc biệt là dòng có công nghệ như Boost, Air, React) sẽ cho cảm giác êm ái, đàn hồi tốt. Giày Fake đế thường cứng và thô hơn.</p>
      
      <p><em>Lưu ý: Các cách trên chỉ mang tính tham khảo cơ bản. Để chắc chắn 100%, bạn nên mua tại các cửa hàng uy tín có cam kết chính hãng như <strong>Shoe Store</strong>.</em></p>
    `
    },
    {
        id: "7",
        slug: "phoi-do-voi-giay-jordan-1",
        title: "Phối Đồ Với Giày Jordan 1: Mặc Gì Để Chất Lừ?",
        date: "30/09/2022",
        description: "Jordan 1 là đôi giày quốc dân không thể thiếu trong tủ đồ. Nhưng phối đồ sao cho đẹp? Xem ngay các outfit cực cháy với JD1 cho cả nam và nữ.",
        thumbnail: "https://sneakerdaily.vn/wp-content/uploads/2022/04/p_10030c16e4644eb8b58eb38d6bd5f31e.jpeg",
        content: `
      <p>Air Jordan 1 không chỉ là một đôi giày bóng rổ, nó là biểu tượng của văn hóa sát mặt đất. Dù là bản High (cổ cao) hay Low (cổ thấp), JD1 đều có thể "cân" mọi phong cách từ đường phố bụi bặm đến lịch sự.</p>

      <div class="toc">
        <h4>Nội dung bài viết</h4>
        <ul>
          <li><a href="#style1">1. Quần ống rộng (Wide Leg)</a></li>
          <li><a href="#style2">2. Quần Jogger cá tính</a></li>
          <li><a href="#style3">3. Quần Short / Giấu quần (Cho nữ)</a></li>
          <li><a href="#style4">4. Layering nhiều lớp</a></li>
        </ul>
      </div>

      <h2 id="style1">1. Quần ống rộng (Wide Leg Pants)</h2>
      <p>Đây là combo "hủy diệt" hiện nay. Một chiếc quần Jeans ống suông hoặc quần Kaki ống rộng phủ nhẹ lên cổ giày Jordan 1 tạo cảm giác phóng khoáng, hack dáng cực đỉnh.</p>
      <p><strong>Tip:</strong> Chọn quần có độ dài vừa phải để lộ một chút mũi giày, tạo hiệu ứng "stack" ở ống quần rất đẹp.</p>
      <img src="https://aaajeans.com/wp-content/uploads/2022/02/phoi-do-voi-jordan-1-1.jpg" alt="Jordan 1 phối quần ống rộng" />

      <h2 id="style2">2. Quần Jogger cá tính</h2>
      <p>Nếu bạn thích phong cách Sporty (thể thao), Jogger là lựa chọn không thể sai. Phần bo gấu của Jogger giúp khoe trọn vẹn đôi giày Jordan 1 của bạn.</p>
      <p>Kết hợp cùng một chiếc áo Hoodie hoặc Bomber Jacket là bạn đã có một outfit chuẩn "dân chơi" bóng rổ.</p>
      <img src="https://aaajeans.com/wp-content/uploads/2022/02/phoi-do-voi-jordan-1-2.jpg" alt="Jordan 1 phối quần jogger" />

      <h2 id="style3">3. Quần Short / Mốt giấu quần (Cho nữ)</h2>
      <p>Với các bạn nữ, Jordan 1 kết hợp cùng quần short hoặc áo phông oversize (mốt giấu quần) là vũ khí lợi hại để khoe đôi chân dài. Phong cách này vừa năng động, trẻ trung lại vừa quyến rũ.</p>
      <p>Nên chọn tất (vớ) cổ cao (Nike Crew Socks) để phối cùng, trông sẽ hài hòa hơn rất nhiều.</p>
        <img src="https://aaajeans.com/wp-content/uploads/2022/02/phoi-do-voi-jordan-1-3.jpg" alt="Jordan 1 phối quần short" />
      <h2 id="style4">4. Quy tắc màu sắc (Color Block)</h2>
      <p>Vì Jordan 1 thường có nhiều phối màu sặc sỡ (Đỏ/Trắng, Xanh/Đen...), nên an toàn nhất là chọn quần áo màu trung tính (Đen, Trắng, Xám, Be).</p>
      <p>Nếu muốn nổi bật, hãy chọn áo có màu trùng với màu của đôi giày (ví dụ: Giày đỏ - Áo đỏ) để tạo sự liên kết cho tổng thể trang phục (Ton-sur-ton).</p>
    `
    }

];