import { useNavigate } from "react-router-dom";
import {
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Gamepad2,
} from "lucide-react";

const categories = [
  { name: "Mobiles", icon: Smartphone },
  { name: "Laptops", icon: Laptop },
  { name: "Fashion", icon: Shirt },
  { name: "Shoes", icon: Footprints },
  { name: "Accessories", icon: Watch },
  { name: "Gaming", icon: Gamepad2 },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto py-14 px-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => navigate(`/?category=${name}`)}
            className="flex flex-col items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow rounded-xl py-8 px-3 text-center cursor-pointer hover:bg-indigo-600 hover:border-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition group"
          >
            <Icon
              size={28}
              className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition"
            />
            <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-white transition">
              {name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
