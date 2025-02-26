import { FilterResponse } from '@/types/Course';
import FilterBlock from './FilterBlock';

interface FilterOption {
    label: string;
    count: number;
    key: string;
    subCategories?: { label: string; count: number; key: string }[];
}

function FilterCoursesList({ filterData }: { filterData: FilterResponse }) {
    const filtersData = [
        {
            title: filterData?.categories?.title,
            options: filterData?.categories?.data.map(
                ({ label, count, subCategories = [] }): FilterOption => ({
                    label,
                    count,
                    key: `category-${label}`,
                    subCategories: subCategories.map((sub) => ({
                        label: sub.label,
                        count: sub.count,
                        key: `subcategory-${sub.label}`
                    }))
                })
            ),
            type: 'checkbox' as const
        },
        {
            title: filterData?.ratings?.title,
            options: filterData?.ratings?.data?.map(
                ({ label, count }): FilterOption => ({
                    label,
                    count,
                    key: `rating-${label}`
                })
            ),
            type: 'radio' as const,
            name: 'rating'
        },
        {
            title: filterData?.authors?.title,
            options: filterData?.authors?.data?.map(
                ({ label, count }): FilterOption => ({
                    label,
                    count,
                    key: `author-${label}`
                })
            ),
            type: 'checkbox' as const
        },
        {
            title: filterData?.levels?.title,
            options: filterData?.levels?.data?.map(
                ({ label, count }): FilterOption => ({
                    label,
                    count,
                    key: `level-${label}`
                })
            ),
            type: 'checkbox' as const
        },
        {
            title: filterData?.price?.title,
            options: filterData?.price?.data?.map(
                ({ label, count }): FilterOption => ({
                    label,
                    count,
                    key: `price-${label}`
                })
            ),
            type: 'checkbox' as const
        },
        {
            title: filterData?.languages?.title,
            options: filterData?.languages?.data?.map(
                ({ label, count }): FilterOption => ({
                    label,
                    count,
                    key: `language-${label}`
                })
            ),
            type: 'checkbox' as const
        }
    ];

    return (
        <div>
            <div className="w-[320px] h-auto bg-primary-50 border border-primary-100 p-5 rounded-lg">
                {filtersData.map((filter) => (
                    <FilterBlock
                        key={filter.title}
                        title={filter.title}
                        options={filter.options}
                        type={filter.type}
                        name={filter.type === 'radio' ? filter.name : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

export default FilterCoursesList;
