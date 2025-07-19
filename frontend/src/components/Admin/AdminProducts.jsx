import { useEffect, useState } from "react";
import { api } from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "topwear",
  brand: "",
  material: "",
  stock: "",
  images: [],
  sizes: [],
  colors: []
};

const categories = ["topwear", "bottomwear"];
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [editImageUploading, setEditImageUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search, filterCategory]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Color management functions
  const addColor = () => {
    setForm(f => ({
      ...f,
      colors: [...f.colors, { name: '', code: '#000000' }]
    }));
  };

  const removeColor = (index) => {
    setForm(f => ({
      ...f,
      colors: f.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index, field, value) => {
    setForm(f => ({
      ...f,
      colors: f.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  // Add Product Modal: handle image upload
  const handleAddImages = async e => {
    const files = Array.from(e.target.files);
    setImageUploading(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, setImageUploading);
      if (url) urls.push({ url });
    }
    setForm(f => ({ ...f, images: [...(f.images || []), ...urls] }));
    setImageUploading(false);
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        images: form.images,
        sizes: form.sizes,
        colors: form.colors
      };
      console.log('Form data being sent:', payload);
      console.log('Form state:', form);
      const response = await api.post("/products", payload);
      console.log('Response:', response.data);
      setShowModal(false);
      setForm(initialForm);
      fetchProducts();
    } catch (err) {
      console.error('Error response:', err.response?.data);
      console.error('Full error:', err);
      console.error('Form data that failed:', form);
      setFormError(err.response?.data?.message || "Failed to add product");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      material: product.material,
      stock: product.stock,
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || []
    });
    setEditId(product._id);
    setEditModal(true);
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditId(null);
    setEditForm(initialForm);
    setEditError(null);
  };

  const handleEditFormChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  // Edit form color management functions
  const addEditColor = () => {
    setEditForm(f => ({
      ...f,
      colors: [...f.colors, { name: '', code: '#000000' }]
    }));
  };

  const removeEditColor = (index) => {
    setEditForm(f => ({
      ...f,
      colors: f.colors.filter((_, i) => i !== index)
    }));
  };

  const updateEditColor = (index, field, value) => {
    setEditForm(f => ({
      ...f,
      colors: f.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  // Edit Product Modal: handle image upload
  const handleEditAddImages = async e => {
    const files = Array.from(e.target.files);
    setEditImageUploading(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, setEditImageUploading);
      if (url) urls.push({ url });
    }
    setEditForm(f => ({ ...f, images: [...(f.images || []), ...urls] }));
    setEditImageUploading(false);
  };

  const handleEditProduct = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const payload = {
        ...editForm,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock, 10),
        images: editForm.images,
        sizes: editForm.sizes,
        colors: editForm.colors
      };
      await api.put(`/products/${editId}`, payload);
      closeEditModal();
      fetchProducts();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update product");
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (productId) => {
    setDeleteId(productId);
    setDeleteModal(true);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteId(null);
    setDeleteError(null);
  };

  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/products/${deleteId}`);
      closeDeleteModal();
      fetchProducts();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cloudinary upload function
  async function uploadToCloudinary(file, setUploading) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecommerce_unsigned");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dlqaafhko/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      alert("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }

  // Helper to move image in array
  function moveImage(arr, from, to) {
    const updated = [...arr];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return updated;
  }

  return (
    <div className="px-2 md:px-8 py-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-48"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Add Product
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : error ? (
                    <div className="text-center text-scars-red py-10">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={product.images?.[0]?.url || "/no-image.png"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        draggable={false}
                        onDragStart={e => e.preventDefault()}
                      />
                    </td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3 capitalize">{product.category}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm" onClick={() => openEditModal(product)}>Edit</button>
                        <button className="px-3 py-1 bg-scars-red text-white rounded hover:bg-red-700 transition text-sm" onClick={() => openDeleteModal(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Product</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => { setShowModal(false); }}
                  aria-label="Close"
                >
                  X
                </button>
              </div>
            </div>
                          <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Price (₹)</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Stock</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange} required className="w-full border rounded px-3 py-2">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Material</label>
                <input name="material" value={form.material} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  className="w-full border rounded px-3 py-2"
                />
                {imageUploading && <div className="text-blue-600 text-sm mt-1">Uploading...</div>}
                {form.images && form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20">
                        <img src={img.url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        <div className="absolute top-1 right-1 flex flex-col gap-1">
                          <button type="button" className="bg-white rounded p-0.5 shadow" disabled={idx === 0} onClick={() => setForm(f => ({ ...f, images: moveImage(f.images, idx, idx-1) }))}>^</button>
                          <button type="button" className="bg-white rounded p-0.5 shadow" disabled={idx === form.images.length-1} onClick={() => setForm(f => ({ ...f, images: moveImage(f.images, idx, idx+1) }))}>v</button>
                          <button type="button" className="bg-scars-red text-white rounded p-0.5 shadow" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}>X</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <label key={size} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={size}
                        checked={form.sizes?.includes(size) || false}
                        onChange={e => {
                          const checked = e.target.checked;
                          setForm(f => ({
                            ...f,
                            sizes: checked
                              ? [...(f.sizes || []), size]
                              : (f.sizes || []).filter(s => s !== size)
                          }));
                        }}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Colors</label>
                <div className="space-y-2">
                  {form.colors.map((color, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Color name"
                        value={color.name}
                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <input
                        type="color"
                        value={color.code}
                        onChange={(e) => updateColor(index, 'code', e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="px-2 py-2 bg-scars-red text-white rounded hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addColor}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 transition"
                  >
                    + Add Color
                  </button>
                </div>
              </div>
              {formError && <div className="text-scars-red text-sm">{formError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                disabled={formLoading}
              >
                {formLoading ? "Adding..." : "Add Product"}
              </button>
            </form>
            </div>
          </div>
        
      )}

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => { closeEditModal(); }}
                  aria-label="Close"
                >
                  X
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input name="name" value={editForm.name} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Price (₹)</label>
                  <input name="price" type="number" min="0" value={editForm.price} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Stock</label>
                  <input name="stock" type="number" min="0" value={editForm.stock} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Category</label>
                  <select name="category" value={editForm.category} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Brand</label>
                  <input name="brand" value={editForm.brand} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Material</label>
                <input name="material" value={editForm.material} onChange={handleEditFormChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditAddImages}
                  className="w-full border rounded px-3 py-2"
                />
                {editImageUploading && <div className="text-blue-600 text-sm mt-1">Uploading...</div>}
                {editForm.images && editForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editForm.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20">
                        <img src={img.url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        <div className="absolute top-1 right-1 flex flex-col gap-1">
                          <button type="button" className="bg-white rounded p-0.5 shadow" disabled={idx === 0} onClick={() => setEditForm(f => ({ ...f, images: moveImage(f.images, idx, idx-1) }))}>^</button>
                          <button type="button" className="bg-white rounded p-0.5 shadow" disabled={idx === editForm.images.length-1} onClick={() => setEditForm(f => ({ ...f, images: moveImage(f.images, idx, idx+1) }))}>v</button>
                          <button type="button" className="bg-scars-red text-white rounded p-0.5 shadow" onClick={() => setEditForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}>X</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <label key={size} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={size}
                        checked={editForm.sizes?.includes(size) || false}
                        onChange={e => {
                          const checked = e.target.checked;
                          setEditForm(f => ({
                            ...f,
                            sizes: checked
                              ? [...(f.sizes || []), size]
                              : (f.sizes || []).filter(s => s !== size)
                          }));
                        }}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Colors</label>
                <div className="space-y-2">
                  {editForm.colors.map((color, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Color name"
                        value={color.name}
                        onChange={(e) => updateEditColor(index, 'name', e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <input
                        type="color"
                        value={color.code}
                        onChange={(e) => updateEditColor(index, 'code', e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeEditColor(index)}
                        className="px-2 py-2 bg-scars-red text-white rounded hover:bg-red-700"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEditColor}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 transition"
                  >
                    + Add Color
                  </button>
                </div>
              </div>
              {editError && <div className="text-scars-red text-sm">{editError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeDeleteModal}
              aria-label="Close"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            {deleteError && <div className="text-scars-red text-sm mb-2">{deleteError}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-scars-red hover:bg-red-700 text-white"
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 