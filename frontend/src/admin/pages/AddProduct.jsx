import { useState } from "react";
import api from "../../api/axios";

export default function AddProduct() {
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
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
      formData.append("image", image);

      // ✅ Correct API route
      const { data } = await api.post("/products/add", formData);

      alert(data.message || "Product added successfully!");

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });

      setImage(null);
      setPreview("");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8">

      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border dark:border-gray-800 rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full border dark:border-gray-800 rounded-lg p-3"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border dark:border-gray-800 rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border dark:border-gray-800 rounded-lg p-3"
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border dark:border-gray-800 rounded-lg p-3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          required
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-48 rounded-lg shadow"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>

      </form>
    </div>
  );
}