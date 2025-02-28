'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import searchIcon from '@/public/assets/icons/search.svg';
import { Course } from '@/types/Course';
import { User } from '@/types/User';
import defaultCourseImage from '@/public/assets/images/courses/courses-01.jpg';
import defaultInstructorImage from '@/public/assets/images/avatar/default-avatar.jpg';
import Link from 'next/link';

export default function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState<{ courses: Course[]; users: User[] }>({
        courses: [],
        users: []
    });

    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showResults, setShowResults] = useState(false); // ✅ State kiểm soát modal

    const searchRef = useRef<HTMLDivElement>(null); // ✅ Ref để kiểm tra click ra ngoài

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, usersRes] = await Promise.all([
                    fetch('http://localhost:8000/api/courses'),
                    fetch('http://localhost:8000/api/user/instructor')
                ]);

                const { courses } = await coursesRes.json();
                const { instructors } = await usersRes.json();
                setCourses(courses);
                setUsers(instructors);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value) {
            const filteredCourses = courses.filter(
                (course) =>
                    course?.name?.toLowerCase().includes(value.toLowerCase()) ||
                    course?.description?.toLowerCase().includes(value.toLowerCase())
            );

            const filteredUsers = users.filter((user) => user?.name?.toLowerCase().includes(value.toLowerCase()));

            setResults({ courses: filteredCourses, users: filteredUsers });
            setShowResults(true); // ✅ Hiện modal khi có kết quả
        } else {
            setResults({ courses: [], users: [] });
            setShowResults(false);
        }
    };

    const handleSelectResult = () => {
        setShowResults(false); // ✅ Ẩn modal khi click vào kết quả
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowResults(false); // ✅ Ẩn modal khi click ra ngoài
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="max-w-[600px] grow relative" ref={searchRef}>
            <form action="#" className="relative z-30">
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

            {showResults && (results.courses.length > 0 || results.users.length > 0) ? (
                <div className="absolute z-20 w-full mt-2 bg-white border border-primary-100 rounded shadow-lg">
                    <div className="py-2">
                        {results.courses.length > 0 && (
                            <div className="px-2">
                                <ul>
                                    {results.courses.map((course) => (
                                        <li
                                            key={course?._id}
                                            className="p-1 hover:bg-primary-50 cursor-pointer flex items-center"
                                            onClick={handleSelectResult} // ✅ Click vào là đóng modal
                                        >
                                            <Link href={`/courses/${course?._id}`}>
                                                <Image
                                                    src={course?.thumbnail?.url || defaultCourseImage}
                                                    alt="Course Image"
                                                    width={40}
                                                    height={40}
                                                    className="rounded mr-2"
                                                />
                                            </Link>
                                            <div>
                                                <div className="font-medium">{course?.name}</div>
                                                <p className="text-sm text-primary-500">
                                                    {course?.description?.length > 50
                                                        ? course.description.slice(0, 50) + '...'
                                                        : course.description}
                                                </p>
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
                                            key={user._id}
                                            className="p-1 hover:bg-primary-50 cursor-pointer flex items-center"
                                            onClick={handleSelectResult} // ✅ Click vào là đóng modal
                                        >
                                            <Link href={`/instructors/${user?._id}`}>
                                                <Image
                                                    src={user?.avatar?.url || defaultInstructorImage}
                                                    alt="User Avatar"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full mr-2"
                                                />
                                            </Link>
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
