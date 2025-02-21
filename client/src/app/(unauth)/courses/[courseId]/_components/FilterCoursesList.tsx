import FilterBlock from './FilterBlock';

function FilterCoursesList() {
    const filtersData: {
        title: string;
        options: { label: string; count: number }[];
        type?: 'checkbox' | 'radio';
        name?: string;
    }[] = [
        {
            title: 'Categories',
            options: [
                { label: 'Web Development', count: 120 },
                { label: 'Software Testing', count: 80 },
                { label: 'Mobile Development', count: 200 },
                { label: 'Game Development', count: 50 },
                { label: 'Software Engineering', count: 95 }
            ],
            type: 'checkbox'
        },
        {
            title: 'Rating',
            options: [
                { label: '5', count: 50 },
                { label: '4', count: 40 },
                { label: '3', count: 30 },
                { label: '2', count: 20 },
                { label: '1', count: 10 }
            ],
            type: 'radio',
            name: 'rating'
        },
        {
            title: 'Instructor',
            options: [
                { label: 'Kathryn Murphy', count: 89 },
                { label: 'Eleanor Pena', count: 58 },
                { label: 'Theresa Webb', count: 135 },
                { label: 'Beatrice Cooper', count: 87 }
            ],
            type: 'checkbox'
        },
        {
            title: 'Level',
            options: [
                { label: 'Beginner', count: 300 },
                { label: 'Intermediate', count: 150 },
                { label: 'Expert', count: 50 }
            ],
            type: 'checkbox'
        },
        {
            title: 'Price',
            options: [
                { label: 'Free', count: 200 },
                { label: 'Paid', count: 300 }
            ],
            type: 'checkbox'
        },
        {
            title: 'Language',
            options: [
                { label: 'English', count: 150 },
                { label: 'French', count: 50 },
                { label: 'German', count: 40 },
                { label: 'Italian', count: 20 },
                { label: 'Turkish', count: 10 }
            ],
            type: 'checkbox'
        },
        {
            title: 'Video Duration',
            options: [
                { label: '0-1 Hour', count: 60 },
                { label: '1-3 Hours', count: 120 },
                { label: '3-6 Hours', count: 80 }
            ],
            type: 'checkbox'
        },
        {
            title: 'Features',
            options: [
                { label: 'Subtitles', count: 100 },
                { label: 'Quizzes', count: 80 },
                { label: 'Coding Exercises', count: 60 }
            ],
            type: 'checkbox'
        }
    ];

    return (
        <div className="">
            <div className="w-[320px] h-auto bg-primary-50 border border-primary-100 p-5 rounded-lg">
                {filtersData.map((filter) => (
                    <FilterBlock
                        key={filter.title} // Sử dụng title làm key
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
