'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import InstructorList from './InstructorsList';

const InstructorListWrapper = () => {
    const searchParams = useSearchParams();
    const sortType = searchParams.get('sort') || 'Date Created';

    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            let sortParam = '';

            if (sortType === 'bestselling') sortParam = 'bestselling';
            else if (sortType === 'oldest') sortParam = 'oldest';
            else if (sortType === 'recent') sortParam = 'recent';

            let apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/user/get-instructors`; // API mặc định
            if (sortParam) {
                apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/user/instructors/sort?type=${sortParam}`;
            }

            try {
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error('Failed to fetch instructors');

                const data = await res.json();

                setInstructors(data.instructors || []);
            } catch (error) {
                console.error('❌ Fetch Error:', error);
                setInstructors([]);
            }
        };

        fetchInstructors();
    }, [sortType]); // Gọi lại API khi `sortType` thay đổi

    return <InstructorList instructors={instructors} />;
};

export default InstructorListWrapper;
