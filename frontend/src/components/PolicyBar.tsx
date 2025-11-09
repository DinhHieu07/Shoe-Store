// src/components/PolicyBar.tsx
"use client";

import React from "react";
import styles from "../styles/PolicyBar.module.css";

// Danh sách các chính sách
const policies = [
    {
        icon: "bx-package", // Icon từ boxicons
        title: "Miễn phí vận chuyển",
        description: "Cho đơn hàng từ 500k",
    },
    {
        icon: "bx-support",
        title: "Hỗ trợ 24/7",
        description: "Luôn sẵn sàng trợ giúp",
    },
    {
        icon: "bx-shield-quarter",
        title: "Bảo hành 1 đổi 1",
        description: "Nếu có lỗi từ nhà sản xuất",
    },
];

const PolicyBar = () => {
    return (
        <section className={styles.policyContainer}>
            {policies.map((policy) => (
                <div key={policy.title} className={styles.policyItem}>
                    {/* Icon */}
                    <i className={`bx ${policy.icon} ${styles.policyIcon}`}></i>

                    {/* Text */}
                    <div className={styles.policyText}>
                        <h5>{policy.title}</h5>
                        <p>{policy.description}</p>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default PolicyBar;