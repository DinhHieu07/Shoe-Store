import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                {/* Cột trái: thông tin nhanh */}
                <div className={styles.left}>
                <span className={styles.brand}>SHOE STORE</span>
                    <span className={styles.dot} />
                    <span className={styles.small}>
                        © {new Date().getFullYear()} — Chính hãng &amp; giá tốt.
                    </span>
                </div>

                {/* Cột giữa: liên hệ ngắn gọn */}
                <div className={styles.middle}>
                    <a
                        className={styles.link}
                        href="tel:0987654321"
                        aria-label="Hotline"
                        title="Gọi 0987654321"
                    >
                        <i className="bx bx-phone" />
                        0987654321
                    </a>
                    <a
                        className={styles.link}
                        href="mailto:shoestore@gmail.com"
                        aria-label="Email"
                        title="Gửi email"
                    >
                        <i className="bx bx-envelope" />
                        shoestore@gmail.com
                    </a>
                    <span className={styles.addr}>
                        <i className="bx bx-map" />
                        Số 1 Đại Cồ Việt, phường Bạch Mai, Thành phố Hà Nội
                    </span>
                </div>

                {/* Cột phải: mạng xã hội */}
                <div className={styles.right}>
                    <Link href="#" aria-label="Facebook" className={styles.iconBtn}>
                        <i className="bx bxl-facebook" />
                    </Link>
                    <Link href="#" aria-label="Instagram" className={styles.iconBtn}>
                        <i className="bx bxl-instagram" />
                    </Link>
                    <Link href="#" aria-label="Tiktok" className={styles.iconBtn}>
                        <i className="bx bxl-tiktok" />
                    </Link>
                    <Link href="#" aria-label="YouTube" className={styles.iconBtn}>
                        <i className="bx bxl-youtube" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
