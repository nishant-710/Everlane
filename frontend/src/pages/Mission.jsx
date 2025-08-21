import React from 'react';
import img8 from '../images/img8.jpg';

export default function Mission() {
  return (
    <div className="relative w-full  ml-10 mx-auto mt-20 px-4 sm:px-6 overflow-x-hidden rounded-[13px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${img8})` }}
      >
        <div className="absolute inset-0 bg-opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center mx-auto w-full max-w-7xl">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-light mb-4 leading-snug">
          We're on a Mission To Clean Up the Industry
        </h1>

        <p className="text-white text-sm sm:text-base mb-6 max-w-xl opacity-90">
          Read about our progress in our latest Impact Report.
        </p>

        <button className="bg-white text-gray-800 px-6 py-2 sm:px-8 sm:py-3 text-xs sm:text-sm font-medium tracking-wider uppercase hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
          Learn More
        </button>
      </div>
    </div>
  );
}
