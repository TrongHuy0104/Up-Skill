import React from 'react';
import BigHorizontalInstructor from '@/components/custom/BigHorizontalInstructor';
import { User } from '@/types/User';
import defaultAvatar from '@/public/assets/images/avatar/default-avatar.jpg';

interface Props {
    instructor: User;
}

export default function Instructor({ instructor }: Props) {
    return (
        <div className="mb-[61px]">
            <h2 className="text-2xl font-bold mb-4 font-cardo">Instructor</h2>

            <BigHorizontalInstructor
                name={instructor?.name}
                profession="Professional Web Developer"
                avatar={instructor?.avatar?.url || defaultAvatar}
                rating={4.9}
                reviews={315475}
                students={345}
                courses={34}
                description="Lorem ipsum dolor sit amet. Qui incidunt dolores non similique ducimus et debitis molestiae. Et autem quia eum reprehenderit voluptates."
            />
        </div>
    );
}
