import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";

export default function Favorites() {
  const navigate = useNavigate();

  const { loading, error, items } = useFavorites();

  if (loading)
    return <div className="text-center py-4">Loading favourites...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-3">
            Everlane Favorites
          </h2>
          <p className="text-base text-gray-600">
            Beautifully Functional. Purposefully Designed. Consciously Crafted.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={3}
            speed={800}
            loop
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="fashion-swiper"
          >
            {items.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="bg-white rounded-xl shadow hover:shadow-2xl transition-transform duration-500 transform hover:-translate-y-2 group">
                  <div className="aspect-[5/5] bg-gray-100 relative overflow-hidden">
                    <img
                      src={`http://localhost:3002/uploads/${product?.image?.[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow transform translate-y-4 group-hover:translate-y-0 transition-all"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-gray-900 flex-1 mr-2 truncate">
                        {product?.name}
                      </h3>
                      <span className="text-lg font-bold text-gray-800">
                        ₹{product?.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sizes: {product.sizes?.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Colors: {product.colors?.join(", ")}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:scale-110 transition">
            <ChevronLeft className="text-gray-700 w-5 h-5" />
          </button>

          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:scale-110 transition">
            <ChevronRight className="text-gray-700 w-5 h-5" />
          </button>

          <div className="swiper-pagination-custom flex justify-center mt-6 space-x-2"></div>
        </div>
      </div>
    </div>
  );
}
