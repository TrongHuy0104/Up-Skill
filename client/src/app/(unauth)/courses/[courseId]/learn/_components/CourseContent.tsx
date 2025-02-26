'use client';

import React, { useState } from 'react';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export default function CourseContent({ content, courseId }: any) {
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const [activeVideo, setActiveVideo] = useState(0);
    return (
        <div className="w-full grid 800px:grid-cols-10">
            <p className="text-primary-800 py-5">{content[activeVideo]?.title}</p>
            <p className="text-primary-800 py-5">{content[activeVideo]?.description}</p>
        </div>
    );
}
