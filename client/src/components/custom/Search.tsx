'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import searchIcon from '@/public/assets/icons/search.svg';
import { Course } from '@/types/Course';
import { User } from '@/types/User';
import defaultCourseImage from '@/public/assets/images/courses/courses-01.jpg';
import defaultInstructorImage from '@/public/assets/images/avatar/default-avatar.jpg';
import Link from 'next/link';
import { Skeleton } from '../ui/Skeleton';

interface SearchResults {
    courses: Course[];
    instructors: User[];
}

// Component hiển thị Skeleton loading
const SearchResultSkeleton = () => (
    <div className="p-1 flex items-center">
        <Skeleton className="h-10 w-10 rounded mr-2" />
        <div className="w-full">
            <Skeleton className="h-4 w-3/4 mb-2 rounded" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-1/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
            </div>
        </div>
    </div>
);

export default function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState<SearchResults>({ courses: [], instructors: [] });
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!searchValue.trim()) {
            setResults({ courses: [], instructors: [] });
            setShowResults(false);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setIsLoading(true);
        setShowResults(true);

        timeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ search: searchValue }),
                });

                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setIsLoading(false);
            }
        }, 1000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [searchValue]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={searchRef}>
            <div className="flex w-[600px] items-center border border-primary-100 rounded-lg p-2">
                <Image src={searchIcon} alt="Search" width={20} height={20} />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="ml-2 flex-grow outline-none"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={() => searchValue.trim() && setShowResults(true)}
                />
            </div>
            {showResults && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-primary-100 rounded shadow-lg">
                    <div className="py-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-primary-100">
                        {isLoading ? (
                            <div className="px-2">
                                {[...Array(5)].map(() => (
                                    <SearchResultSkeleton key={crypto.randomUUID()} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {results.courses.length > 0 && (
                                    <div className="px-2">
                                        {results.courses.map((course) => (
                                            <Link key={course._id} href={`/courses/${course._id}`} legacyBehavior>
                                                <a
                                                    className="p-1 hover:bg-primary-50 cursor-pointer flex items-center pt-2"
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            window.location.href = `/courses/${course._id}`;
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        src={course?.thumbnail?.url || defaultCourseImage}
                                                        alt="Course Image"
                                                        width={40}
                                                        height={40}
                                                        className="rounded mr-2"
                                                    />
                                                    <div>
                                                        <div className="font-medium hover:text-accent-600">
                                                            {course?.name}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm text-black w-auto">
                                                                {course?.authorId?.name || 'Unknown'}
                                                            </div>
                                                            <p className="text-sm text-primary-500">
                                                                {course?.description?.length > 50
                                                                    ? `${course.description.slice(0, 50)}...`
                                                                    : course.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {results.instructors.length > 0 && (
                                    <div className="px-2">
                                        {results.instructors.map((user) => (
                                            <Link key={user._id} href={`/instructors/${user._id}`} legacyBehavior>
                                                <a
                                                    className="p-1 hover:bg-primary-50 cursor-pointer flex items-center pt-2"
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            window.location.href = `/instructors/${user._id}`;
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        src={user?.avatar?.url || defaultInstructorImage}
                                                        alt="User Avatar"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full mr-2"
                                                    />
                                                    <div>
                                                        <div className="font-medium hover:text-accent-600">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-primary-500">{user.role}</div>
                                                    </div>
                                                </a>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {results.courses.length === 0 && results.instructors.length === 0 && (
                                    <div className="text-center text-gray-500 p-2">No course or instructor match</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
