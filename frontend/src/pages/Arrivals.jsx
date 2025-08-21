import React, { useEffect } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { fetchProductsByCategory } from '../features/trending/productSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Arrivals = () => {

  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.products);
  const categoryid = useSelector(state => state.nav.categoryid);
  const categoryHeroid = useSelector(state => state.nav.categoryHeroid);

  console.log('hgfghjkjhghj:::::::',{items})
  useEffect(() => {
    console.log('changed',{categoryid,categoryHeroid})
    // debugger;
    if (categoryid && categoryHeroid) {
      dispatch(fetchProductsByCategory({ categoryId: categoryid, filterId: categoryHeroid }));
    }
  }, [categoryid, categoryHeroid, dispatch]);
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full h-[40vh]"
      >
        {items && items?.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full group overflow-hidden mt-5">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-500" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-wide">
                  {item.name}
                </h2>
                <button className="bg-white text-black px-6 py-2 text-sm tracking-widest font-medium uppercase hover:bg-gray-200 transition-all duration-300">
                  {/* {item.buttonText} */}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Arrivals;
