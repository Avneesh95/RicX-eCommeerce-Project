import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);

      const product = res.data.product;

      setForm({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("stock", form.stock);

    if (image) {
      data.append("image", image);
    }

    try {
      await api.put(`/products/${id}`, data);

      alert("Product Updated Successfully");

      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-gray-900 dark:text-white">Loading...</h2>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Edit Product
      </h1>

      <form onSubmit={submitHandler} className="space-y-5">

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={changeHandler}
          placeholder="Product Name"
          className="w-full border dark:border-gray-800 p-3 rounded-lg"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={changeHandler}
          rows="4"
          placeholder="Description"
          className="w-full border dark:border-gray-800 p-3 rounded-lg"
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={changeHandler}
          placeholder="Category"
          className="w-full border dark:border-gray-800 p-3 rounded-lg"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={changeHandler}
          placeholder="Price"
          className="w-full border dark:border-gray-800 p-3 rounded-lg"
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={changeHandler}
          placeholder="Stock"
          className="w-full border dark:border-gray-800 p-3 rounded-lg"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
        >
          Update Product
        </button>

      </form>

    </div>
  );
};

export default EditProduct;