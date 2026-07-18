import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-all duration-500">

      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Categories */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <Categories />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-14 px-6">

        <div className="text-center mb-14">

          <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold mb-4">
            ✨ Trending Collection
          </span>

          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Featured Products
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our latest arrivals, exclusive collections and
            best-selling products carefully selected just for you.
          </p>

        </div>

        <ProductGrid />

      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-all duration-500">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold mb-5 text-gray-900 dark:text-white">
              Why Choose
              <span className="text-indigo-600"> RicX?</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Premium shopping experience with quality products and secure service.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-3 transition-all duration-500">

              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-5xl group-hover:scale-110 transition">
                🚚
              </div>

              <h3 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">
                Fast Delivery
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mt-3">
                Lightning-fast shipping with secure packaging across India.
              </p>

            </div>

            <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-green-500/20 hover:-translate-y-3 transition-all duration-500">

              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-5xl group-hover:scale-110 transition">
                💳
              </div>

              <h3 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">
                Secure Payments
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mt-3">
                Protected transactions powered by Razorpay encryption.
              </p>

            </div>

            <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-3 transition-all duration-500">

              <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-5xl group-hover:scale-110 transition">
                ⭐
              </div>

              <h3 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">
                Premium Quality
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mt-3">
                Handpicked products with guaranteed quality and durability.
              </p>

            </div>

            <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-pink-500/20 hover:-translate-y-3 transition-all duration-500">

              <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-5xl group-hover:scale-110 transition">
                🛡️
              </div>

              <h3 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">
                Trusted Store
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mt-3">
                Thousands of happy customers trust RicX every day.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
};

export default Home;