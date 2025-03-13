import { cookies } from 'next/headers';
import CreateEditCourse from './_components/CreateEditCourse';
import { ROLE } from '@/lib/constants';
import { redirect } from 'next/navigation';

interface Category {
    _id: string;
    title: string;
    subCategories: Array<{
        _id: string;
        title: string;
    }>;
}

interface Level {
    _id: string;
    name: string;
}

export default async function page({ params }: any) {
    const { courseId } = await params;
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const [categoriesResponse, levelsResponse, userResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/category/all`, {
            credentials: 'include',
            headers: { Cookie: cookie }
        }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/level`, {
            credentials: 'include',
            headers: { Cookie: cookie }
        }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
            credentials: 'include',
            headers: { Cookie: cookie }
        })
    ]);

    if (!categoriesResponse.ok || !levelsResponse.ok || !userResponse.ok) {
        throw new Error('Failed to fetch data');
    }

    const { user } = await userResponse.json();

    if (user?.role !== ROLE.instructor || !user.uploadedCourses.includes(courseId)) redirect('/');

    const { categories } = await categoriesResponse.json();
    const { levels } = await levelsResponse.json();

    const formattedLevels = levels.map((level: Level) => ({
        label: level.name,
        value: level._id
    }));

    const formattedCategories = categories.map((category: Category) => ({
        label: category.title,
        value: category._id,
        subCategories: category.subCategories.map((subCategory) => ({
            label: subCategory.title,
            value: subCategory._id
        }))
    }));

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <CreateEditCourse courseId={courseId} levels={formattedLevels} categories={formattedCategories} />
        </div>
    );
}
