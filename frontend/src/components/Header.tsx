"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { apiLogout } from "../services/apiLogout";
import { link } from "fs";
import { useCart } from '@/context/CartContext';

// 1. IMPORT COMPONENT SEARCHBOX MỚI
import SearchBox from "./SearchBox";

export default function Header() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null); // for mobile accordion
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userFullname, setUserFullname] = useState<string>("");
    const [userAvatar, setUserAvatar] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);
    const { cartItems } = useCart();

    useEffect(() => {
        const customer = localStorage.getItem("customer");
        const fullname = localStorage.getItem("fullname");
        const avatar = localStorage.getItem("avatar");
        setIsLoggedIn(!!customer);
        setUserFullname(fullname || "");
        setUserAvatar(avatar || "");
        if (customer && JSON.parse(customer).role === 'admin') {
            setIsAdmin(true);
        }

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

    // Thay thế mảng `menus` cũ bằng mảng này
    const menus = [
        { label: "Trang chủ", link: "/" },
        { label: "Quản lý sản phẩm", link: "/admin/products" },
        {
            label: "Giày Nike",
            link: "/giay-nike", // Link cho chính "Giày Nike"
            submenu: [
                { label: "Nike Air Force 1", link: "/giay-nike/air-force-1" },
                { label: "Air Jordan 1", link: "/giay-nike/air-jordan-1" },
                { label: "Giày Nike Nữ", link: "/giay-nike/nike-nu" },
            ],
        },
        {
            label: "Giày Adidas",
            link: "/giay-adidas",
            submenu: [
                { label: "Superstar", link: "/giay-adidas/superstar" },
                { label: "Ultraboost", link: "/giay-adidas/ultraboost" },
                { label: "Stan Smith", link: "/giay-adidas/stan-smith" },
            ],
        },
        {
            label: "Giày MLB",
            link: "/giay-mlb",
            submenu: [
                { label: "MLB Chunky", link: "/giay-mlb/chunky" },
                { label: "MLB Playball", link: "/giay-mlb/playball" },
            ],
        },
        {
            label: "Phụ kiện",
            link: "/phu-kien",
            submenu: [
                { label: "Áo", link: "/phu-kien/ao" },
                { label: "Túi", link: "/phu-kien/tui" },
                { label: "Nón", link: "/phu-kien/non" },
            ],
        },
        { label: "Blog", link: "/blog" },
    ];

    // Đếm số lượng sản phẩm riêng biệt (số items), không phải tổng quantity
    const distinctCount = cartItems.length;

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

                        {/* 2. THAY THẾ FORM CŨ BẰNG SEARCHBOX MỚI */}
                        {/* Giữ lại class styles.searchBox để giữ vị trí layout, nhưng bỏ style border/background nếu có vì SearchBox đã có style riêng */}
                        <div className={styles.searchBox} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                            <SearchBox />
                        </div>

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
                                            {isAdmin && (
                                                <li>
                                                    <Link href="/admin/messages">
                                                        Quản lý tin nhắn
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <Link href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                                    Đăng xuất
                                                </Link>
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
                            <Link href="/shoppingcart" aria-label="Giỏ hàng" className={styles.cartIcon}>
                                🛒 &nbsp; Giỏ hàng
                                <span className={styles.cartCount}>
                                    {distinctCount}
                                </span>
                            </Link>
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
                    <ul
                        id="primary-navigation"
                        className={`${styles.menu} ${isNavOpen ? styles.menuOpen : ""}`}
                    >
                        {menus.map((menu) => (
                            <li
                                key={menu.label}
                                className={styles.menuItem}
                                onMouseEnter={() => handleMouseEnter(menu.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {menu.submenu ? (
                                    <Link
                                        href={menu.link || "#"}
                                        className={styles.menuButton}
                                        aria-haspopup="true"
                                        aria-controls={`submenu-${menu.label}`}
                                        onClick={(e) => {
                                            if (!isDesktop()) {
                                                e.preventDefault();
                                                handleToggleSubmenu(menu.label);
                                            }

                                        }}
                                    >
                                        {menu.label}
                                        <span className={styles.caret} />
                                    </Link>
                                ) : (
                                    <Link href={menu.link || "#"}>{menu.label}</Link>
                                )}
                                {menu.submenu &&
                                    (isDesktop() ? activeMenu === menu.label : openSubmenu === menu.label) && (
                                        <ul id={`submenu-${menu.label}`} className={styles.submenu}>
                                            {menu.submenu.map((subItem) => (
                                                <li key={subItem.label}>
                                                    <Link href={subItem.link}>{subItem.label}</Link>
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