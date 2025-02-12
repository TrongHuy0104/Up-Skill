'use client';

import Image from 'next/image';
import { HiArrowUpRight } from 'react-icons/hi2';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface CourseSidebarProps {
  price: number;
  originalPrice: number;
  discount: number;
  videoHours: number;
  articles: number;
  resources: number;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  price,
  originalPrice,
  discount,
  videoHours,
  articles,
  resources,
}) => {
  const handleAddToCart = () => {
    console.log('Added to cart:', price);
  };  
  const handleBuyNow = () => {
    console.log('Proceed to checkout:', price);
  };
  return (
    <div className="rounded-2xl shadow-lg max-w-sm bg-primary-50 border">
      <div className="relative w-full h-64 flex justify-center items-center">
        <Image
          src="/assets/images/courses/courses-03.jpg"
          alt="Course Thumbnail"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
         <div className="absolute w-16 h-16 bg-primary-50 rounded-3xl flex justify-center items-center shadow-md cursor-pointer">
          <Image
            src="/assets/icons/play.svg"
            alt="Play Icon"
            width={16}
            height={16}
          />
        </div>
      </div>
      <div className="p-6 flex justify-center items-center">
        <p className="text-[26px] font-base text-accent-900 font-semibold mr-4">${price.toFixed(2)}</p>
        <p className="text-[15px] text-primary-800 line-through mr-12">${originalPrice.toFixed(2)}</p>
        <p className="text-[14px] text-accent-900 bg-accent-100 font-medium py-2 px-4 border border-accent-900 rounded-lg">{discount}% OFF</p>
      </div>
      <div className="">
        <button
            onClick={handleAddToCart}
            className="w-[320px] bg-primary-800 text-primary-50 px-6 py-4 rounded-md hover:bg-accent-900 flex items-center justify-center gap-2 text-base font-medium m-auto mb-4"
            >
            Add To Cart <HiArrowUpRight />
        </button>
        <button
            onClick={handleBuyNow}
            className="w-[320px] bg-primary-50 text-primary-800 px-6 py-4 rounded-md border border-primary-800 hover:border-accent-900 flex items-center justify-center gap-2 text-base font-medium m-auto mb-4"
            >
            Buy Now <HiArrowUpRight />
        </button>
      </div>
      <p className="text-center text-sm text-primary-800">30-Day Money-Back Guarantee</p>
      <div className="p-6 space-y-4 text-sm border-b">
        <p className="text-[18px] font-medium text-primary-800 py-2">This course includes:</p>
        <p className="text-[15px] text-primary-800 flex items-center gap-2">
          <Image src="/assets/icons/play-outline.svg" alt="Play-Outline Icon" width={18} height={18}/>
          {videoHours} hours on-demand video</p>
        <p className="text-[15px] text-primary-800 flex items-center gap-2">
          <Image src="/assets/icons/timetable.svg" alt="Timetable Icon" width={18} height={18}/>
          {articles} articles</p>
        <p className="text-[15px] text-primary-800 flex items-center gap-2">
          <Image src="/assets/icons/arrow-down.svg" alt="Arrow-Down Icon" width={18} height={18}/>
          {resources} downloadable resources</p>
        <p className="text-[15px] text-primary-800 flex items-center gap-2">
          <Image src="/assets/icons/cart.svg" alt="Cart Icon" width={18} height={18}/>
          Access on mobile and TV</p>
        <p className="text-[15px] text-primary-800 flex items-center gap-2">
          <Image src="/assets/icons/hour.svg" alt="Hour Icon" width={18} height={18}/>
          Full lifetime access</p>
        <p className="text-[15px] text-primary-800 flex items-center gap-2">
          <Image src="/assets/icons/star-outline.svg" alt="Star-Outline Icon" width={18} height={18}/>
          Certificate of completion</p>
      </div>
      <div className="text-center mt-6">
        <p className="text-[16px] font-medium text-primary-800">Share this course</p>
        <div className="flex justify-center gap-4 mt-4 mb-4">
          <FaFacebook className="cursor-pointer text-primary-800 hover:text-blue-600 text-5xl border rounded-full p-2" />
          <FaTwitter className="cursor-pointer text-primary-800 hover:text-blue-400 text-5xl border rounded-full p-2" />
          <FaInstagram className="cursor-pointer text-primary-800 hover:text-pink-500 text-5xl border rounded-full p-2" />
          <FaLinkedin className="cursor-pointer text-primary-800 hover:text-blue-700 text-5xl border rounded-full p-2" />
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
