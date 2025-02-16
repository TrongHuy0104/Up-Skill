import React from 'react';
import Banner from '@/components/ui/Banner';

export default function BannerInstructors() {
    return (
        <div>
            <Banner
                title="Instructor"
                breadcrumbs={[
                    { text: 'Home', href: '/' },
                    { text: 'Pages', href: '/pages' },
                    { text: 'Instructor', href: '/pages/instructor' }
                ]}
                contentAlignment="center"
                backgroundColor="bg-accent-100" // Customize background color
                background="url('/path/to/your/image.png')" // Set the background image
                buttonPosition="right" // Position button to the right
            >
                <p>Products that help beginner designers become true unicorns.</p>
            </Banner>
        </div>
    );
}
