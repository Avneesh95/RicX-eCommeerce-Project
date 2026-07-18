import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { getProductById, updateProduct } from "../../api/productApi";

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const { data } = await getProductById(editId);
        const p = data.product;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock,
        });
        setPreview(p.image?.url || "");
      } catch (err) {
        console.log(err);
      }
    })();
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editId && !image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      if (image) formData.append("image", image);

      if (editId) {
        await updateProduct(editId, formData);
        alert("Product updated successfully!");
      } else {
        await api.post("/products/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully!");
      }

      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        {editId ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3"
          required
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3"
            required
          />
        </div>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg p-3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full text-gray-700 dark:text-gray-300"
        />

        {preview && (
          <img src={preview} alt="Preview" className="w-48 rounded-lg shadow" />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
