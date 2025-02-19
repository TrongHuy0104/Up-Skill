import { useGetCategoriesQuery, Category } from "@/lib/redux/features/category/categoryApi";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import arrowDownIcon from "@/public/assets/icons/arrow-down.svg";

export default function CategoryComponent() {
  const { data: categories = []} = useGetCategoriesQuery();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
        <div className="group relative flex items-center justify-center gap-[10px] px-5 py-[10px] hover:bg-accent-100 cursor-pointer rounded">
            <span className="font-medium text-[14px]">Categories</span>
            <Image src={arrowDownIcon} alt="Arrow Down Icon" />
            <div className="absolute top-0 left-0 right-0 h-[66px]" />
            <ul className="absolute left-0 top-full min-w-[330px] rounded bg-primary-50 border border-primary-100 opacity-0 invisible pointer-events-none translate-y-[18px] 
                transition ease-linear delay-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-[10px] group-hover:pointer-events-auto">
                <li className="h-[60px] leading-[60px] line pt-2 text-[14px] text-primary-800 font-medium px-4 cursor-default">
                    COURSE CATEGORIES
                </li>
                {categories.map((category: Category) => (
                <li
                    key={category._id}
                    onMouseEnter={() => setHoveredCategory(category._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="relative flex justify-between items-center px-5 py-[15px] cursor-pointer text-base font-medium hover:bg-accent-100 
                              hover:text-accent-900 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-transparent 
                              hover:before:bg-accent-900"
                >
                <Link href={`/courses?category=${category.title}`} className="w-full">
                  {category.title}
                </Link>

                {category.subCategories && category.subCategories.length > 0 && (
                  <span className="ml-2">&#9656;</span>
                )}

              {hoveredCategory === category._id && category.subCategories && (
              <ul className="absolute left-[100%] top-0 w-[330px] bg-accent-100 shadow-lg rounded-md border border-primary-100 flex flex-col min-h-full">
                {category.subCategories.map((sub) => (
                  <li key={sub._id} className="px-5 py-[15px] text-primary-800 text-base font-medium hover:bg-accent-100 hover:text-accent-900 cursor-pointer">
                    <Link href={`/courses?category=${category.title}&subCategory=${sub.title}`} className="w-full">
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
