'use client';

import { useState } from 'react';
import Image from 'next/image';
import searchIcon from '@/public/assets/icons/search.svg';

// Dữ liệu giả lập
const mockKeywords = ['React', 'JavaScript', 'Python', 'Web Development', 'Machine Learning'];

const mockCourses = [
    {
        id: 1,
        title: 'React.js Fundamentals',
        description: 'Learn the basics of React.js',
        image: '/assets/images/courses/courses-01.jpg'
    },
    {
        id: 2,
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts',
        image: '/assets/images/courses/courses-02.jpg'
    },
    {
        id: 3,
        title: 'Python for Beginners',
        description: 'Get started with Python programming',
        image: '/assets/images/courses/courses-03.jpg'
    }
];

const mockUsers = [
    { id: 1, name: 'John Doe', role: 'Instructor', avatar: '/assets/images/avatar/user-1.png' },
    { id: 2, name: 'Jane Smith', role: 'Student', avatar: '/assets/images/avatar/user-2.png' },
    { id: 3, name: 'Alice Johnson', role: 'Instructor', avatar: '/assets/images/avatar/user-3.png' }
];

interface SearchResults {
    keywords: string[];
    courses: { id: number; title: string; description: string; image: string }[];
    users: { id: number; name: string; role: string; avatar: string }[];
}

export default function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState<SearchResults>({
        keywords: [],
        courses: [],
        users: []
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value) {
            const filteredKeywords = mockKeywords.filter((keyword) =>
                keyword.toLowerCase().includes(value.toLowerCase())
            );

            const filteredCourses = mockCourses.filter(
                (course) =>
                    course.title.toLowerCase().includes(value.toLowerCase()) ||
                    course.description.toLowerCase().includes(value.toLowerCase())
            );

            const filteredUsers = mockUsers.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));

            setResults({
                keywords: filteredKeywords,
                courses: filteredCourses,
                users: filteredUsers
            });
        } else {
            setResults({
                keywords: [],
                courses: [],
                users: []
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Search submitted:', searchValue);
    };

    return (
        <div className="max-w-[600px] grow relative">
            <form action="#" className="relative z-30" onSubmit={handleSubmit}>
                <fieldset className="mb-0 w-full">
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="shadow-none w-full py-2 px-5 pr-6 text-sm leading-7 bg-primary-50 border border-primary-100 rounded text-primary-600"
                        name="searchValue"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </fieldset>
                <div className="absolute right-5 top-2/4 transform translate-y-[-50%] h-5">
                    <button type="submit" className="p-1 cursor-pointer">
                        <Image src={searchIcon} alt="Search Icon" className="relative -top-1 text-[21px]" />
                    </button>
                </div>
            </form>
            {results.keywords.length > 0 || results.courses.length > 0 || results.users.length > 0 ? (
                <div className="absolute z-20 w-full mt-2 bg-white border border-primary-100 rounded shadow-lg">
                    <div className="py-2">
                        {results.keywords.length > 0 && (
                            <div className="px-2">
                                <ul>
                                    {results.keywords.map((keyword) => (
                                        <li
                                            key={keyword}
                                            className="p-1 hover:bg-primary-50 cursor-pointer flex items-center"
                                        >
                                            <Image src={searchIcon} alt="Search Icon" className="mr-6 ml-2" />{' '}
                                            {/* Biểu tượng tìm kiếm */}
                                            {keyword}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {results.courses.length > 0 && (
                            <div className="px-2">
                                <ul>
                                    {results.courses.map((course) => (
                                        <li
                                            key={course.id}
                                            className="p-1 hover:bg-primary-50 cursor-pointer flex items-center"
                                        >
                                            <Image
                                                src={course.image}
                                                alt="Course Image"
                                                width={40}
                                                height={40}
                                                className="rounded mr-2"
                                            />
                                            <div>
                                                <div className="font-medium">{course.title}</div>
                                                <div className="text-sm text-primary-500">{course.description}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {results.users.length > 0 && (
                            <div className="px-2">
                                <ul>
                                    {results.users.map((user) => (
                                        <li
                                            key={user.id}
                                            className="p-1 hover:bg-primary-50 cursor-pointer flex items-center"
                                        >
                                            <Image
                                                src={user.avatar}
                                                alt="User Avatar"
                                                width={40}
                                                height={40}
                                                className="rounded-full mr-2"
                                            />
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-primary-500">{user.role}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
