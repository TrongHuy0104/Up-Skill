import CourseSidebar from "@/components/ui/CourseSidebar";

const Page = () => {
    return (
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 py-10">
          {/* Nội dung chính của khóa học */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold">Content</h1>
          </div>
    
          {/* Sidebar khóa học */}
          <div className="w-full md:w-1/3">
            <CourseSidebar
              price={249.00}
              originalPrice={449.00}
              discount={39}
              videoHours={54.5}
              articles={3}
              resources={249}
            />
          </div>
        </div>
      );
    };    

export default Page;
