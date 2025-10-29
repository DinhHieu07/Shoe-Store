'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/ProductManagement.module.css';
import { apiAddCategory } from '@/services/apiCategory';
import { apiGetCategories } from '@/services/apiCategory';
import Toast from '@/components/Toast';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, Box, InputLabel } from '@mui/material';
import { apiAddProduct, apiDeleteProduct, apiGetProducts, apiEditProduct } from '@/services/apiProduct';

interface Product {
  _id: string;
  name: string;
  brand: string;
  basePrice: string;
  images: string[];
  category: string;
  categoryIds: Category[];
  description: string;
  variants?: Variant[];
}

interface Category {
  _id: string;
  name: string;
}

interface Variant {
  sku: string;
  size: string;
  color: string;
  price: string;
  stock: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addCategoryResult, setAddCategoryResult] = useState(false);
  const [addProductResult, setAddProductResult] = useState(false);
  const [deleteProductResult, setDeleteProductResult] = useState(false);
  const [editProductResult, setEditProductResult] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState('');
  const [categoryData, setCategoryData] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([
    { sku: '', size: '', color: '', price: '', stock: '' }
  ]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmEditId, setConfirmEditId] = useState<string | null>(null);
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Khóa scroll của body khi mở modal (sản phẩm hoặc danh mục)
  useEffect(() => {
    const hasAnyModal = showAddModal || showAddCategoryModal;
    if (hasAnyModal) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [showAddModal, showAddCategoryModal]);

  const fetchCategories = async () => {
    const data = await apiGetCategories();
    setCategories(data.data);
  };

  const fetchProducts = async () => {
    const data = await apiGetProducts();
    if (data.success) {
      setProducts(data.products);
    } else {
      console.error(data.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = productImages.split(',');
    const data = await apiAddProduct(productName, productDescription, productBrand, productCategory, productPrice, variants, images);
    if (data.success) {
      console.log(data.product);
      setProducts([...products, data.product]);
      setMessage(data.message);
      setType('success');
      setAddProductResult(true);
      setProductName('');
      setProductDescription('');
      setProductBrand('');
      setProductCategory('');
      setProductPrice('');
      setProductImages('');
      setVariants([{ sku: '', size: '', color: '', price: '', stock: '' }]);
      setShowAddModal(false);
    }
    else {
      setMessage(data.message);
      setType('error');
      setAddProductResult(true);
      setProductName('');
    }
  };

  const handleDelete = async (id: string) => {
    const data = await apiDeleteProduct(id);
    if (data.success) {
      setProducts(products.filter((product) => product._id !== id));
      setMessage(data.message);
      setType('success');
      fetchProducts();
      setConfirmDeleteId(null);
      setDeleteProductResult(true);
    }
    else {
      setMessage(data.message);
      setType('error');
      setDeleteProductResult(true); 
    }
  };

  const handleRequestDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleEdit = (product: Product) => {
    setConfirmEditId(product._id);
    setEditingProduct(product);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryData.trim() === '') {
      setMessage('Vui lòng nhập tên danh mục');
      setType('error');
      setAddCategoryResult(true);
      return;
    }
    const data = await apiAddCategory(categoryData.trim());
    if (data.success) {
      setMessage(data.message);
      setType('success');
      setAddCategoryResult(true);
      setCategories([...categories, data.data]);
      setCategoryData("");
      setShowAddCategoryModal(false);
    } else {
      setMessage(data.message);
      setType('error');
      setAddCategoryResult(true);
      setCategoryData("");
      setShowAddCategoryModal(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await apiEditProduct(confirmEditId || '', editingProduct?.name || '', editingProduct?.description || '', editingProduct?.brand || '', editingProduct?.basePrice || '', editingProduct?.variants || [], editingProduct?.images || []);
    if (data.success) {
      setMessage(data.message);
      setType('success');
      setEditProductResult(true);
      setProducts(products.map((product) => product._id === confirmEditId ? data.product : product));
      setConfirmEditId(null);
      setEditingProduct(null);
    }
    else {
      setMessage(data.message);
      setType('error');
      setEditProductResult(true);
      setConfirmEditId(null);
      setEditingProduct(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý sản phẩm</h1>
        <div className={styles.buttonContainer}>
          <button className={styles.addButton} onClick={() => setShowAddCategoryModal(true)}  >
            + Thêm danh mục
          </button>
          <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product?.images?.[0] || 'https://placehold.co/600x400'}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                {/* Base price có thể là string từ API; hiển thị trực tiếp */}
                <td>{product.basePrice || '-'}</td>
                <td>{product.variants?.reduce((acc, curr) => acc + Number(curr.stock), 0) || 0}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => { setDetailProduct(product); setShowDetailModal(true); }}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleRequestDelete(product._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowAddModal(false); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Thêm sản phẩm mới</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="productName">Tên sản phẩm *</label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <Box sx={{ minWidth: 120, marginBottom: '20px' }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={productCategory}
                    label="Danh mục"
                    onChange={(e) => setProductCategory(e.target.value)}
                  >
                    {categories.map((category: Category) => (
                      <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <div className={styles.formGroup}>
                <label htmlFor="productBrand">Thương hiệu *</label>
                <input
                  id="productBrand"
                  type="text"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  placeholder="Nhập thương hiệu (VD: Nike, Adidas, ...)"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="productPrice">Giá cơ bản (VND) *</label>
                <input
                  id="productPrice"
                  type="text"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Nhập giá cơ bản"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Biến thể theo kích thước/màu sắc</label>
                {variants.map((variant, index) => (
                  <div key={index} className={styles.variantRow}>
                    <input
                      type="text"
                      placeholder="Mã sp"
                      value={variant.sku}
                      onChange={(e) => {
                        const next = [...variants];
                        next[index].sku = e.target.value;
                        setVariants(next);
                      }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Kích thước"
                      value={variant.size}
                      onChange={(e) => {
                        const next = [...variants];
                        next[index].size = e.target.value;
                        setVariants(next);
                      }}
                      required
                      title='Nhập kích thước'
                    />
                    <input
                      type="text"
                      placeholder="Màu sắc"
                      value={variant.color}
                      onChange={(e) => {
                        const next = [...variants];
                        next[index].color = e.target.value;
                        setVariants(next);
                      }}
                      required
                      title='Nhập màu sắc'
                    />
                    <input
                      type="text"
                      placeholder="Giá biến thể (VND)"
                      value={variant.price}
                      onChange={(e) => {
                        const next = [...variants];
                        next[index].price = e.target.value;
                        setVariants(next);
                      }}
                      required
                      title='Nhập giá biến thể (VND)'
                    />
                    <input
                      type="text"
                      placeholder="Tồn kho"
                      value={variant.stock}
                      onChange={(e) => {
                        const next = [...variants];
                        next[index].stock = e.target.value;
                        setVariants(next);
                      }}
                      required
                      title='Nhập tồn kho'
                    />
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                      aria-label="Xóa biến thể"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <div className={styles.variantAddBar}>
                  <button
                    type="button"
                    className={styles.submitButton}
                    onClick={() => setVariants([...variants, { sku: '', size: '', color: '', price: '', stock: '' }])}
                  >
                    + Thêm biến thể
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="productDescription">Mô tả</label>
                <textarea
                  id="productDescription"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="productImages">URL hình ảnh (phân cách bởi dấu phẩy)</label>
                <input
                  id="productImages"
                  type="text"
                  value={productImages}
                  onChange={(e) => setProductImages(e.target.value)}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Thêm sản phẩm
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => { setShowAddModal(false); }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCategoryModal && (
        <div className={styles.modalOverlayCategory} onClick={() => { setShowAddCategoryModal(false); }}>
          <div className={styles.modalContentCategory} onClick={(e) => e.stopPropagation()}>
            <h2>Thêm danh mục</h2>
            <form >
              <div className={styles.categoryFormGroup}>
                <label htmlFor="categoryName">Tên danh mục *</label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryData}
                  onChange={(e) => setCategoryData(e.target.value)}
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>
              <div className={styles.listCategory}>
                <h3>Danh sách danh mục hiện tại:</h3>
                <ul>
                  {categories?.map((category: Category) => (
                    <li key={category._id}>{category.name}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.modalButtonsCategory}>
                <button type="submit" className={styles.submitButtonCategory} onClick={handleAddCategory}>
                  Thêm danh mục
                </button>
                <button
                  type="button"
                  className={styles.cancelButtonCategory}
                  onClick={() => { setShowAddCategoryModal(false); }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDeleteId(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ color: '#000' }}>
            <h2>Xác nhận xóa</h2>
            <div className={styles.formGroup}>
              Bạn có chắc muốn xóa sản phẩm này?
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.submitButton} onClick={() => handleDelete(confirmDeleteId)}>Xóa</button>
              <button className={styles.cancelButton} onClick={() => setConfirmDeleteId(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {confirmEditId && (
        <div className={styles.modalOverlay} onClick={() => { setConfirmEditId(null); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ color: '#000' }}>
            <h2>Sửa sản phẩm</h2>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="productName">Tên sản phẩm *</label>
                <input
                  id="productName"
                  type="text"
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productBrand">Thương hiệu *</label>
                <input
                  id="productBrand"
                  type="text"
                  value={editingProduct?.brand || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, brand: e.target.value } : prev)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productPrice">Giá cơ bản (VND) *</label>
                <input
                  id="productPrice"
                  type="text"
                  value={editingProduct?.basePrice || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, basePrice: e.target.value } : prev)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productCategory">Biến thể theo kích thước/màu sắc</label>
                {editingProduct?.variants?.map((variant, index) => (
                  <div key={index} className={styles.variantRow}>
                    <input
                      type="text"
                      placeholder="Mã sp"
                      value={variant.sku}
                      onChange={(e) => {
                         setEditingProduct(prev => prev ? { ...prev, variants: (prev.variants || []).map((v, i) => i === index ? { ...v, sku: e.target.value } : v) } : prev);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Kích thước"
                      value={variant.size}
                      onChange={(e) => {
                         setEditingProduct(prev => prev ? { ...prev, variants: (prev.variants || []).map((v, i) => i === index ? { ...v, size: e.target.value } : v) } : prev);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Màu sắc"
                      value={variant.color}
                      onChange={(e) => {
                         setEditingProduct(prev => prev ? { ...prev, variants: (prev.variants || []).map((v, i) => i === index ? { ...v, color: e.target.value } : v) } : prev);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Giá biến thể (VND)"
                      value={variant.price}
                      onChange={(e) => {
                         setEditingProduct(prev => prev ? { ...prev, variants: (prev.variants || []).map((v, i) => i === index ? { ...v, price: e.target.value } : v) } : prev);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Tồn kho"
                      value={variant.stock}
                      onChange={(e) => {
                         setEditingProduct(prev => prev ? { ...prev, variants: (prev.variants || []).map((v, i) => i === index ? { ...v, stock: e.target.value } : v) } : prev);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productDescription">Mô tả</label>
                <textarea
                  id="productDescription"
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : prev)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="productImages">URL hình ảnh (phân cách bởi dấu phẩy)</label>
                <input
                  id="productImages"
                  type="text"
                  value={editingProduct?.images?.join(',') || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } as any : prev)}
                />
              </div>
            </form>
            <div className={styles.modalButtons}>
              <button type="submit" className={styles.submitButton} onClick={handleSubmitEdit}>
                Cập nhật
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => setConfirmEditId(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}  

      {showDetailModal && detailProduct && (
        <div className={styles.modalOverlay} onClick={() => { setShowDetailModal(false); setDetailProduct(null); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ color: '#000' }}>
            <h2>Chi tiết sản phẩm</h2>
            <div className={styles.formGroup}>
              <strong>Tên:</strong> {detailProduct.name}
            </div>
            <div className={styles.formGroup}>
              <strong>Danh mục:</strong> {detailProduct.category}
            </div>
            <div className={styles.formGroup}>
              <strong>Thương hiệu:</strong> {detailProduct.brand}
            </div>
            <div className={styles.formGroup}>
              <strong>Giá cơ bản:</strong> {detailProduct.basePrice || '-'}
            </div>
            <div className={styles.formGroup}>
              <strong>Mô tả:</strong> {detailProduct.description || '-'}
            </div>
            <div className={styles.formGroup}>
              <strong>Hình ảnh:</strong>
              <div className={styles.detailImages}>
                {(detailProduct.images || []).map((img, idx) => (
                  <img key={idx} src={img} alt={`img-${idx}`} className={styles.detailImageItem} />
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <strong>Biến thể:</strong>
              <table className={`${styles.table} ${styles.detailTable}`}>
                <thead>
                  <tr>
                    <th>Mã SP</th>
                    <th>Kích thước</th>
                    <th>Màu sắc</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  {(detailProduct.variants && detailProduct.variants.length > 0
                    ? detailProduct.variants
                    : []).map((v, i) => (
                    <tr key={i}>
                      <td>{v.sku}</td>
                      <td>{v.size}</td>
                      <td>{v.color}</td>
                      <td>{v.price}</td>
                      <td>{v.stock}</td>
                    </tr>
                  ))}
                  {(!detailProduct.variants || detailProduct.variants.length === 0) && (
                    <tr>
                      <td colSpan={5}>Không có biến thể</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.modalButtons}>
              <button type="button" className={styles.cancelButton} onClick={() => { setShowDetailModal(false); setDetailProduct(null); }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {addCategoryResult && <Toast message={message} type={type} onClose={() => setAddCategoryResult(false)} />}
      {addProductResult && <Toast message={message} type={type} onClose={() => setAddProductResult(false)} />}
      {deleteProductResult && <Toast message={message} type={type} onClose={() => setDeleteProductResult(false)} />}
      {editProductResult && <Toast message={message} type={type} onClose={() => setEditProductResult(false)} />}
    </div>
  );
}