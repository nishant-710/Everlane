import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useDispatch } from "react-redux";
import useSliders from "../hooks/useSliders";
import { useNavigate } from "react-router-dom";
import img9 from "../images/img9.jpg";

const Container = () => {
  const BASE_URL_IMAGE = useMemo(() => "http://localhost:3002/uploads/", []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slides, loading, error, mainId, handleCategoryClick } = useSliders();

  const handleProductDetails = (id) => {
    navigate(`/productDetails/${id}`);
  };

  if (loading || error) {
    return (
      <div className="mx-auto mt-5 px-4 w-full">
        <div className="bg-[#212844] rounded-[15px] flex items-center justify-center py-5">
          <div className="text-white text-base sm:text-lg">
            {loading ? "Loading sliders..." : `Error: ${error}`}
          </div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="mx-auto mt-10 px-4 sm:px-6 lg:px-8 max-w-full overflow-hidden">
      <div className="bg-[#212844] rounded-[15px]">
        <Swiper
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet opacity-60",
            bulletActiveClass: "swiper-pagination-bullet-active opacity-100",
          }}
          modules={[Pagination]}
          loop={slides.length > 1}
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 text-white cursor-pointer"
                onClick={handleCategoryClick}
              >
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-lg sm:text-xl lg:text-3xl font-bold mb-2">
                    {item?.title}
                  </h1>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">
                    {item?.productDetails?.offer?.type}{" "}
                    {item?.productDetails?.offer?.value} Rs. Off
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg mb-4 opacity-90">
                    {item?.description || "New Collection"}
                  </p>
                  <button
                    className="bg-white text-black text-sm sm:text-base px-4 py-2 rounded-md hover:bg-gray-200 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductDetails(item?.productDetails?._id);
                    }}
                  >
                    Shop Now
                  </button>
                </div>

                <div className="flex-1 flex justify-center mt-6 lg:mt-0">
                  <img
                    src={
                      item?.imageWeb
                        ? `${BASE_URL_IMAGE}${item.imageWeb}`
                        : img9
                    }
                    alt={item?.description || "Slider image"}
                    className="w-[140px] sm:w-[150px] md:w-[160px] lg:w-[170px] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Container;
