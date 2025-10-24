"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";

export default function Header() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleMouseEnter = (menu: string) => setActiveMenu(menu);
    const handleMouseLeave = () => setActiveMenu(null);

    const menus = [
        { label: "Trang chủ", link: "/" },
        {
            label: "Giày Nike",
            submenu: ["Nike Air Force 1", "Air Jordan 1", "Giày Nike Nữ"],
        },
        {
            label: "Giày Adidas",
            submenu: ["Superstar", "Ultraboost", "Stan Smith"],
        },
        { label: "Giày MLB", submenu: ["MLB Chunky", "MLB Playball"] },
        { label: "Phụ kiện", submenu: ["Áo", "Túi", "Nón"] },
        { label: "Blog", link: "/blog" },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.topWrap}>
                <div className={styles.inner}>
                    <div className={styles.headerTop}>
                        <div className={styles.logo}>
                            <a href="/">
                                <img src="https://file.hstatic.net/200000581855/file/logo_authentic-trang-01__1___1__8d1bbc4e7d994a56b91e06fb91a0dc5e.png" alt="" /></a>
                        </div>

                        {/* SEARCH BOX */}
                        <form
                            className={styles.searchBox}
                            onSubmit={(e) => {
                                e.preventDefault();
                                // TODO: điều hướng đến trang search nếu bạn muốn
                                // const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement)?.value;
                                // router.push(`/search?q=${encodeURIComponent(q)}`);
                            }}
                        >
                            <input
                                className={styles.searchInput}
                                type="search"
                                placeholder="Nhập tên sản phẩm"
                                aria-label="Tìm kiếm sản phẩm"
                            />
                            <button className={styles.searchButton} type="submit" aria-label="Tìm kiếm">
                                <img
                                    src="https://theme.hstatic.net/200000581855/1000933616/14/search-icon.svg?v=453"
                                    alt="Tìm kiếm"
                                    className={styles.searchIcon}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </button>
                        </form>


                        <div className={styles.headerIcons}>
                            <Link href="#">Đăng ký</Link>
                            <Link href="#">Đăng nhập</Link>
                            <Link href="#">🛒 Giỏ hàng</Link>
                        </div>

                    </div>
                </div>
            </div>

            <nav className={styles.navBar}>
                <div className={styles.inner}>
                    <ul className={styles.menu}>
                        {menus.map((menu) => (
                            <li
                                key={menu.label}
                                className={styles.menuItem}
                                onMouseEnter={() => handleMouseEnter(menu.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link href={menu.link || "#"}>{menu.label}</Link>

                                {menu.submenu && activeMenu === menu.label && (
                                    <ul className={styles.submenu}>
                                        {menu.submenu.map((item) => (
                                            <li key={item}>
                                                <Link href="#">{item}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
