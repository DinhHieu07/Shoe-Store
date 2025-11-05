'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/VoucherManagement.module.css';
import { apiAddVoucher, apiDeleteVoucher, apiEditVoucher, apiGetVouchers } from '@/services/apiVoucher';
import { VoucherPayload } from '@/types/voucher';
import { useRouter } from 'next/navigation';
import { Box, InputLabel, MenuItem, Select } from '@mui/material';
import { FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Toast from '@/components/Toast';

export default function VoucherManagement() {
    const router = useRouter();
    const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<VoucherPayload | null>(null);
    const [form, setForm] = useState<Partial<VoucherPayload>>({ discountType: undefined, isActive: true });
    const [query, setQuery] = useState('');
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return vouchers;
        return vouchers.filter(v => v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q));
    }, [query, vouchers]);

    useEffect(() => {
        const hasAnyModal = showModal;
        if (hasAnyModal) {
          const previousOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
          return () => {
            document.body.style.overflow = previousOverflow;
          };
        }
      }, [showModal]);

    useEffect(() => {
        // Chặn non-admin
        const customer = typeof window !== 'undefined' ? localStorage.getItem('customer') : null;
        const role = customer ? (JSON.parse(customer || '{}').role) : undefined;
        if (role !== 'admin') {
            alert('Bạn không có quyền truy cập trang này');
            router.replace('/');
            return;
        }
        const fetch = async () => {
            const res = await apiGetVouchers();
            if (res.success) setVouchers(res.vouchers || []);
        };
        fetch();
    }, [router]);

    const openCreate = () => { setEditing(null); setForm({ discountType: undefined, isActive: true }); setShowModal(true); };
    const openEdit = (v: VoucherPayload) => { setEditing(v); setForm(v); setShowModal(true); };

    const save = async () => {
        console.log(form);
        if (!form.name || !form.code || !form.expiryDate) return;

        if (form.discountType !== 'shipping' && !form.discountValue) {
            alert('Vui lòng nhập giá trị voucher');
            return;
        }
        const payload = { ...form, code: (form.code as string).toUpperCase() };
        if (editing?._id) {
            const res = await apiEditVoucher(editing._id, payload as VoucherPayload);
            if (res.success) {
                setToast({ message: 'Cập nhật voucher thành công', type: 'success' });
                setVouchers(prev => prev.map(x => x._id === editing._id ? res.voucher : x));
                setShowModal(false);
            }
        } else {
            const res = await apiAddVoucher(payload as VoucherPayload);
            console.log(res);
            if (res.success) {
                setToast({ message: 'Tạo voucher thành công', type: 'success' });
                setVouchers(prev => [res.voucher, ...prev]);
                setShowModal(false);
            }
        }
    };

    const remove = async (id: string) => {
        const yes = confirm('Xóa voucher này?');
        if (!yes) return;
        const res = await apiDeleteVoucher(id);
        if (res.success) {
            setToast({ message: 'Xóa voucher thành công', type: 'success' });
            setVouchers(prev => prev.filter(v => v._id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý Voucher</h1>
                <div className={styles.headerActions}>
                    <input className={styles.search} placeholder="Tìm theo tên hoặc mã..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button className={styles.primaryBtn} onClick={openCreate}>+ Tạo voucher</button>
                </div>
            </div>

            <div className={styles.grid}>
                {filtered.map(v => (
                    <div key={v._id} className={`${styles.card} ${!v.isActive ? styles.cardDisabled : ''}`}>
                        <div className={styles.cardHead}>
                            <div className={styles.voucherCode}>{v.code}</div>
                            <div className={styles.badges}>
                                <span className={styles.badge}>
                                    {v.discountType === 'shipping' 
                                        ? 'Miễn phí vận chuyển' 
                                        : v.discountType === 'fixed' 
                                            ? `${(v.discountValue || 0).toLocaleString('vi-VN')}đ` 
                                            : `${v.discountValue || 0}%`}
                                </span>
                                {!v.isActive && <span className={`${styles.badge} ${styles.badgeGray}`}>Tắt</span>}
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.title}>{v.name}</div>
                            {v.description && <div className={styles.desc}>{v.description}</div>}
                            <div className={styles.metaRow}>
                                <div>ĐH tối thiểu: {v.minOrderAmount?.toLocaleString('vi-VN') || 0}đ</div>
                                <div>Giới hạn: {v.usageLimit || '∞'} | Đã dùng: {v.usedCount || 0}</div>
                            </div>
                            <div className={styles.metaRow}>
                                <div>Từ: {new Date(v.startDate).toLocaleDateString('vi-VN')}</div>
                                <div>Đến: {new Date(v.expiryDate).toLocaleDateString('vi-VN')}</div>
                            </div>
                        </div>
                        <div className={styles.cardActions}>
                            <button className={styles.secondaryBtn} onClick={() => openEdit(v)}>Sửa</button>
                            <button className={styles.dangerBtn} onClick={() => remove(v._id)}>Xóa</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className={styles.empty}>Chưa có voucher</div>
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHead}>
                            <h3>{editing ? 'Cập nhật voucher' : 'Tạo voucher'}</h3>
                        </div>
                        <div className={styles.formGrid}>
                            <label htmlFor="name">Tên</label>
                            <input id="name" placeholder="Nhập tên voucher" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />

                            <label htmlFor="code">Mã</label>
                            <input id="code" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Nhập mã voucher" />

                            <label htmlFor="description">Mô tả</label>
                            <input id="description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Nhập mô tả voucher" />
                            
                            <Box sx={{ minWidth: 120, marginTop: '20px' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" className={styles.muiLabel}>Loại giảm</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={form.discountType || ''}
                                        label="Loại giảm"
                                        onChange={(e) => {
                                            const newType = e.target.value as 'percentage' | 'fixed' | 'shipping';
                                            setForm({ 
                                                ...form, 
                                                discountType: newType,
                                                discountValue: newType === 'shipping' ? undefined : form.discountValue
                                            });
                                        }}
                                    >
                                        <MenuItem value="percentage">Phần trăm</MenuItem>
                                        <MenuItem value="fixed">Số tiền</MenuItem>
                                        <MenuItem value="shipping">Miễn phí vận chuyển</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {form.discountType !== 'shipping' && (
                                <>
                                    <label htmlFor="discountValue">Giá trị</label>
                                    <input id="discountValue" type="number" value={form.discountValue as any || ''} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} placeholder="Nhập giá trị voucher" />
                                </>
                            )}

                            {form.discountType === 'percentage' && (
                                <>
                                    <label htmlFor="maxDiscount">Giảm tối đa (nếu %)</label>
                                    <input id="maxDiscount" type="number" value={form.maxDiscount as any || ''} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} placeholder="Nhập giá trị giảm tối đa" />
                                </>
                            )}

                            <label htmlFor="minOrderAmount">Đơn tối thiểu</label>
                            <input id="minOrderAmount" type="number" value={form.minOrderAmount as any || ''} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} placeholder="Nhập đơn tối thiểu" />

                            <label htmlFor="usageLimit">Giới hạn lượt dùng</label>
                            <input id="usageLimit" type="number" value={form.usageLimit as any || ''} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} placeholder="Nhập giới hạn lượt dùng" />

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <div>
                                    <label htmlFor="startDate">Ngày bắt đầu</label>
                                    <DatePicker
                                        value={form.startDate ? new Date(form.startDate as any) : null}
                                        onChange={(newValue: Date | null) =>
                                            setForm({ ...form, startDate: newValue ? new Date(newValue as Date).toISOString() : undefined })
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="expiryDate">Ngày hết hạn</label>
                                    <DatePicker
                                        value={form.expiryDate ? new Date(form.expiryDate as any) : null}
                                        onChange={(newValue: Date | null) =>
                                            setForm({ ...form, expiryDate: newValue ? new Date(newValue as Date).toISOString() : undefined })
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                            </LocalizationProvider>
                            
                            <Box sx={{ minWidth: 120, marginTop: '20px' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" className={styles.muiLabel}>Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={form.isActive}
                                        label="Trạng thái"
                                        onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                                    >
                                        <MenuItem value="true">Kích hoạt</MenuItem>
                                        <MenuItem value="false">Tạm tắt</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.primaryBtn} onClick={save}>{editing ? 'Lưu' : 'Tạo'}</button>
                            <button className={styles.secondaryBtn} onClick={() => setShowModal(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}


