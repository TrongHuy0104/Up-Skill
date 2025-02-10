"use client"

import { useState } from "react";
import { DM_Sans } from 'next/font/google';
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function CourseContent() {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  

interface Lecture {
    title: string;
    duration: string;
    preview: boolean;
}

interface Section {
    title: string;
    lectures?: Lecture[] | number;
    duration?: string;
}

const sections: Section[] = [
    {
        title: "Program Information 2023/2024 Edition",
        lectures: [
            { title: "About The Course", duration: "01:20", preview: true },
            { title: "Tools Introduction", duration: "07:50", preview: true },
            { title: "Basic Document Structure", duration: "06:30", preview: true },
            { title: "HTML5 Foundations Certification Final Project", duration: "02:40", preview: false },
        ],
    },
    { title: "Certified HTML5 Foundations 2023/2024", duration: "9 min" ,
      lectures: [
        { title: "About The Course", duration: "01:20", preview: true },
        { title: "Tools Introduction", duration: "07:50", preview: true },
        { title: "Basic Document Structure", duration: "06:30", preview: true },
        { title: "HTML5 Foundations Certification Final Project", duration: "02:40", preview: false },
    ],
    },
    { title: "Your Development Toolbox", duration: "9 min",
      lectures: [
        { title: "About The Course", duration: "01:20", preview: true },
        { title: "Tools Introduction", duration: "07:50", preview: true },
        { title: "Basic Document Structure", duration: "06:30", preview: true },
        { title: "HTML5 Foundations Certification Final Project", duration: "02:40", preview: false },
    ],
    },
    { title: "JavaScript Specialist", duration: "9 min",
      lectures: [
        { title: "About The Course", duration: "01:20", preview: true },
        { title: "Tools Introduction", duration: "07:50", preview: true },
        { title: "Basic Document Structure", duration: "06:30", preview: true },
        { title: "HTML5 Foundations Certification Final Project", duration: "02:40", preview: false },
    ],
    },
];

const toggleSection = (index: number): void => {
    setOpenSections((prev) => ({
        ...prev,
        [index]: !prev[index],
    }));
};

  return (
    <div className={cn(dmSans.className, "max-w-[900px] mx-auto p-4 ")}>
      <h2 className="text-xl font-bold mb-4">Course Content</h2>
      <div className="border rounded-lg ">
        {sections.map((section, index) => (
          <div key={index} className="border-b p-4">
            <button
              className={`w-full text-left p-2 flex  items-center font-bold mb-1 gap-x-3 ${
                openSections[index] ? 'border-b' : ''
              }`}
              onClick={() => toggleSection(index)}
            >
              <span >{openSections[index] ? "−" : "+"}</span>
              {section.title}
            </button>
            {openSections[index] && section.lectures && Array.isArray(section.lectures) && (
              <div className="p-4 bg-white">
                {section.lectures.map((lecture, i) => (
                  <div key={i} className="flex justify-between py-2 ">
                    <span>{lecture.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">{lecture.duration}</span>
                      {lecture.preview && (
                        <button className="text-orange-500 border border-orange-500 px-2 py-1 text-sm rounded">Preview</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="mt-4 w-full text-blue-600 border-t pt-4">78 More Sections ↗</button>
    </div>
  );
}
