import { cookies } from 'next/headers';
import CreateCourse from './_components/CreateCourse';
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default async function page() {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const res = await fetch('http://localhost:8000/api/category/all', {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    const { categories } = await res.json();

    const levelResponse = await fetch('http://localhost:8000/api/level', {
        credentials: 'include',
        headers: {
            Cookie: cookie
        }
    });

    const { levels } = await levelResponse.json();

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Suspense fallback={<DashboardSkeleton />}>
                <CreateCourse
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
            </Suspense>
        </div>
    );
}
