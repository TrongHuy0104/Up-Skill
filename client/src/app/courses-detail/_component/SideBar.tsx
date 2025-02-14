import CourseSidebar from '@/components/ui/CourseSidebar';

const Sidebar = () => {
    return (
        <div>
            <CourseSidebar
                price={249.0}
                originalPrice={449.0}
                discount={39}
                videoHours={54.5}
                articles={3}
                resources={249}
            />
        </div>
    );
};

export default Sidebar;
