import React from 'react';
import BigHorizontalInstructor from '@/components/custom/BigHorizontalInstructor';

export default function Instructor() {
    return (
        <div className="mb-[61px]">
            <h2 className="text-2xl font-bold mb-4">Instructor</h2>

            <BigHorizontalInstructor
                name="Theresa Edin"
                profession="Professional Web Developer"
                avatar="/assets/images/instructors/instructors-01.jpg"
                rating={4.9}
                reviews={315475}
                students={345}
                courses={34}
                description="Lorem ipsum dolor sit amet. Qui incidunt dolores non similique ducimus et debitis molestiae. Et autem quia eum reprehenderit voluptates."
            />
        </div>
    );
}
