import { cookies } from 'next/headers';
import CreateEditCourse from './_components/CreateEditCourse';

export default async function page({ params }: any) {
    const { courseId } = await params;
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/category/all`, {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    const levelResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/level`, {
        credentials: 'include',
        headers: {
            Cookie: cookie
        }
    });

    const { categories } = await res.json();
    const { levels } = await levelResponse.json();

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <CreateEditCourse
                courseId={courseId}
                levels={levels.map((level: any) => ({
                    label: level.name,
                    value: level._id
                }))}
                categories={categories.map((category: any) => ({
                    label: category.title,
                    value: category._id,
                    subCategories: category.subCategories.map((subCategory: any) => ({
                        label: subCategory.title,
                        value: subCategory._id
                    }))
                }))}
            />
        </div>
    );
}
