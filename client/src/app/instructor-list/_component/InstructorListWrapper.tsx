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
            else if (sortType === '3days') sortParam = '3days';

            let apiUrl = 'http://localhost:8000/api/user/get-instructors'; // API mặc định
            if (sortParam) {
                apiUrl = `http://localhost:8000/api/user/get-instructors-with-sort?filterType=${sortParam}`;
            }

            console.log('📢 Fetching API:', apiUrl);

            try {
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error('Failed to fetch instructors');

                const data = await res.json();
                console.log('📢 API Response:', data);

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
