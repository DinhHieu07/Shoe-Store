"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiSearchProducts } from "@/services/apiProduct";
import styles from "@/styles/SearchBox.module.css"; // Sẽ tạo file CSS này sau

// Định nghĩa kiểu dữ liệu kết quả tìm kiếm
interface SearchResult {
    _id: string;
    name: string;
    images: string[];
    basePrice: number;
    discountPrice?: number;
    variants: { sku: string }[];
}

export default function SearchBox() {
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Xử lý Debounce: Chỉ gọi API sau khi ngừng gõ 300ms (tránh gọi API liên tục)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (keyword.trim().length > 1) {
                const res = await apiSearchProducts(keyword);
                if (res.success) {
                    setSuggestions(res.data);
                    setShowDropdown(true);
                }
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- LOGIC ĐIỀU HƯỚNG THÔNG MINH ---
    const handleSmartSearch = () => {
        setShowDropdown(false); // Ẩn dropdown
        const lowerKey = keyword.toLowerCase().trim();

        // 1. Logic cho Hãng (Brand)
        if (lowerKey.includes("nike") && !lowerKey.includes("air")) {
            router.push("/giay-nike");
            return;
        }
        if (lowerKey.includes("adidas")) {
            router.push("/giay-adidas");
            return;
        }
        if (lowerKey.includes("mlb")) {
            router.push("/giay-mlb");
            return;
        }

        // 2. Logic cho Dòng sản phẩm (Sub-category)
        if (lowerKey.includes("air force") || lowerKey.includes("af1")) {
            router.push("/giay-nike/air-force-1"); // Đảm bảo đúng slug bạn đã định nghĩa
            return;
        }
        if (lowerKey.includes("jordan")) {
            router.push("/giay-nike/jordan");
            return;
        }

        // 3. Logic mặc định: Vào trang tìm kiếm chung (nếu bạn chưa có trang này thì báo lỗi hoặc vào trang chủ)
        // router.push(`/search?q=${keyword}`); 
        alert(`Đang tìm kiếm chung cho: ${keyword}. (Bạn cần tạo trang /search nếu muốn hiển thị danh sách kết quả đầy đủ)`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSmartSearch();
        }
    };

    return (
        <div className={styles.searchWrapper} ref={wrapperRef}>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => keyword.length > 1 && setShowDropdown(true)}
                />
                <button className={styles.searchBtn} onClick={handleSmartSearch} aria-label="Tìm kiếm">
                    {/* Sử dụng SVG Icon hiện đại */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor" /* Màu sẽ ăn theo màu chữ của button (màu trắng) */
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>

            {/* DROPDOWN GỢI Ý */}
            {showDropdown && suggestions.length > 0 && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>KẾT QUẢ TÌM KIẾM</div>
                    {suggestions.map((product) => (
                        <Link
                            key={product._id}
                            href={`/product/${product.variants[0]?.sku || product._id}`}
                            className={styles.itemLink}
                            onClick={() => setShowDropdown(false)}
                        >
                            <div className={styles.itemRow}>
                                <img
                                    src={product.images[0] || "/placeholder.png"}
                                    alt={product.name}
                                    className={styles.itemImg}
                                />
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemName}>{product.name}</div>
                                    <div className={styles.itemPrice}>
                                        {product.discountPrice ? (
                                            <>
                                                <span className={styles.newPrice}>{product.discountPrice.toLocaleString()}đ</span>
                                                <span className={styles.oldPrice}>{product.basePrice.toLocaleString()}đ</span>
                                            </>
                                        ) : (
                                            <span className={styles.newPrice}>{product.basePrice.toLocaleString()}đ</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div
                        className={styles.viewAll}
                        onClick={handleSmartSearch}
                    >
                        Xem tất cả kết quả cho "{keyword}"
                    </div>
                </div>
            )}
        </div>
    );
}