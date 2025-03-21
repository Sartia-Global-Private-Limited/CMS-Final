import React from "react";
import { Swiper } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const SwiperSlider = ({ children, showpage }) => {
  return (
    <Swiper
      className="p-2 pb-5"
      modules={[Autoplay, Pagination]}
      spaceBetween={30}
      slidesPerView={showpage}
      // loop={true}
      pagination={{
        clickable: true,
        type: "bullets",
      }}
      // speed={6000}
      // autoplay={{
      //     delay: 1,
      // }}
    >
      {children}
    </Swiper>
  );
};

export default SwiperSlider;
