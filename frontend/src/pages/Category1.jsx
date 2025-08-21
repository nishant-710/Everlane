import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import img4 from "../images/img4.png";
import useCategoryProducts from "../hooks/useCategoryProducts";
import img12 from "../images/img12.png";

const Category1 = () => {
  const navigate = useNavigate();

  const { loading, error, products, categories, handleCategoryClick } =
    useCategoryProducts();

  const handleProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    handleCategoryClick();
  }, []);

  console.log({ categories });

  return (
    <div className="mx-auto px-6 max-w-screen-xl font-sans">
      <h1 className="text-2xl sm:text-3xl font-extrabold mt-8 mb-6 text-center text-gray-900">
        Shop by Category
      </h1>

      <div className="overflow-hidden py-4 px-6 rounded-lg bg-white shadow-sm">
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          pagination={{ clickable: true }}
          loop={true}
          modules={[Pagination]}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {categories?.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => handleCategoryClick(item._id)}
                className="cursor-pointer flex flex-col items-center justify-center text-gray-900 p-5 border border-gray-300 rounded-lg hover:shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] object-cover rounded-full border-4 border-gray-100 mb-4 shadow-sm"
                />
                <h3 className="text-base sm:text-lg font-semibold">
                  {item.title}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {loading && (
        <div className="text-blue-600 text-center mt-6 font-medium">
          Loading products...
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center mt-6 font-medium">{error}</div>
      )}

      {products.length > 0 && (
        <div className="mt-8 px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-gray-900">
            Products
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product, i) => (
              <li key={i} className="text-gray-700">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden relative group shadow-sm hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="absolute top-2 right-2 z-10 flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < (product?.stars || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                      </svg>
                    ))}
                  </div>

                  <img
                    src={`http://localhost:3002/uploads/${
                      product.image || img4
                    }`}
                    alt={product.name}
                    className="w-full object-cover aspect-square group-hover:scale-110 transition-transform duration-300"
                    onClick={() => handleProductDetails(product?._id)}
                  />

                  <div className="mt-5 text-center text-[15px] font-medium px-3 pb-4 truncate">
                    {product?.name}
                  </div>
                  <div className="text-center text-[15px] font-medium text-gray-600">
                    {product?.price}
                  </div>
                  <div className="text-center text-[15px] font-medium text-gray-600">
                    {product?.brand}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Category1;
