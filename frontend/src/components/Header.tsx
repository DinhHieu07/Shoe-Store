"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { apiLogout } from "../services/apiLogout";

export default function Header() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null); // for mobile accordion
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userFullname, setUserFullname] = useState<string>("");
    const [userAvatar, setUserAvatar] = useState<string>("");
    useEffect(() => {
        const customer = localStorage.getItem("customer");
        const fullname = localStorage.getItem("fullname");
        const avatar = localStorage.getItem("avatar");
        setIsLoggedIn(!!customer);
        setUserFullname(fullname || "");
        setUserAvatar(avatar || "");
    }, []);

    const isDesktop = () => typeof window !== "undefined" && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const handleMouseEnter = (menu: string) => {
        if (isDesktop()) setActiveMenu(menu);
    };
    const handleMouseLeave = () => {
        if (isDesktop()) setActiveMenu(null);
    };
    const handleToggleSubmenu = (menu: string) => {
        // mobile: toggle accordion
        setOpenSubmenu(prev => (prev === menu ? null : menu));
    };

    const handleLogout = async () => {
        try {
            const result = await apiLogout();
            if (result.success) {
                window.location.href = "/";
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error(error);
            window.location.href = "/";
        }
    };

    const menus = [
        { label: "Trang chủ", link: "/" },
        { label: "Quản lý sản phẩm", link: "/admin/products" },
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
                            <Link href="/" title="Trang chủ">
                                <img src="https://res.cloudinary.com/doefyjqiy/image/upload/v1761569309/logo_k2l8no.jpg" alt="SHOE STORE" />
                            </Link>
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
                            <button className={styles.searchButton} type="submit" aria-label="Tìm kiếm" title="Tìm kiếm">
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
                            {isLoggedIn ? (
                                <div className={styles.userMenuContainer}>
                                    <div 
                                        className={styles.welcomeMessage}
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                    >
                                        <img src={userAvatar} alt="User Avatar" className={styles.userAvatar} />
                                        Xin chào, {userFullname}
                                        <span className={styles.dropdownArrow}>&#9660;</span>
                                    </div>
                                    {showUserMenu && (
                                        <ul className={styles.userDropdown}>
                                            <li>
                                                <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                                                    Hồ sơ
                                                </Link>
                                            </li>
                                            <li>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                                    Đăng xuất
                                                </a>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link href="/register">Đăng ký</Link>
                                    <Link href="/login">Đăng nhập</Link>
                                </>
                            )}
                            <Link href="#" aria-label="Giỏ hàng">🛒 Giỏ hàng</Link>
                        </div>

                    </div>
                </div>
            </div>

            <nav className={styles.navBar}>
                <div className={styles.inner}>
                    <button
                        className={styles.navToggle}
                        aria-label="Mở menu"
                        aria-controls="primary-navigation"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                        <span className={styles.burger} />
                        <span className={styles.burger} />
                        <span className={styles.burger} />
                    </button>

                    <ul id="primary-navigation" className={`${styles.menu} ${isNavOpen ? styles.menuOpen : ''}`}>
                        {menus.map((menu) => (
                            <li
                                key={menu.label}
                                className={styles.menuItem}
                                onMouseEnter={() => handleMouseEnter(menu.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {menu.submenu ? (
                                    <button
                                        className={styles.menuButton}
                                        aria-haspopup="true"
                                        aria-controls={`submenu-${menu.label}`}
                                        onClick={() => handleToggleSubmenu(menu.label)}
                                    >
                                        {menu.label}
                                        <span className={styles.caret} />
                                    </button>
                                ) : (
                                    <Link href={menu.link || "#"}>{menu.label}</Link>
                                )}

                                {menu.submenu && ((isDesktop() ? activeMenu === menu.label : openSubmenu === menu.label)) && (
                                    <ul id={`submenu-${menu.label}`} className={styles.submenu}>
                                        {menu.submenu.map((item) => (
                                            <li key={item}>
                                                <Link href={menu.link || "#"}>{item}</Link>
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