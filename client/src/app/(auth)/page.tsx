import Banner from './Banner';

const breadcrumbsData1 = [
    { href: 'index.html', text: 'Home' },
    { href: '#', text: 'Page' },
    { href: '#', text: 'Shop' },
];

const breadcrumbsData2 = [
    { href: 'index.html', text: 'Home' },
    { href: '#', text: 'Development' },
    { href: '#', text: 'Web Development' },
];

export default function Page() {
    return (
        <div>
            {/* Shop cart banner */}
            <Banner title="Shop Cart" breadcrumbs={breadcrumbsData1} contentAlignment="center">
                <h6 className="text-gray-600">
                    Products that help beginner designers become true unicorns.
                </h6>
            </Banner>

            {/* Web Development banner */}
            <Banner
                title="Web Development Courses"
                breadcrumbs={breadcrumbsData2}
                contentAlignment="left"
            >
                <p className="text-gray-600 mb-6">
                    With one of our online web development courses, you can explore different areas of this
                    in-demand field.
                </p>
                <div className="widget tags-list mt-8">
                    <h6 className="font-medium text-lg mb-4">Topics related to Web Development</h6>
                    <ul className="flex flex-wrap gap-4">
                        {/* Add sample tags */}
                        <li className="px-4 py-2 rounded">Frontend</li>
                        <li className="px-4 py-2 rounded">Backend</li>
                        <li className="px-4 py-2 rounded">Fullstack</li>
                    </ul>
                </div>
            </Banner>

            {/* Instructor banner */}
            <Banner
                title="Welcome, Ali Tufan"
                breadcrumbs={[
                ]}
                contentAlignment="left"
                backgroundColor="bg-green-100"
                button={
                    <a className="tf-btn style-secondary" href="instructor-add-course.html">
                        Create a New Course <i className="icon-arrow-top-right"></i>
                    </a>
                }
            >
                {/* Author Avatar */}
                <div className="author-item">
                    <div className="author-item-img">
                        <img src="	https://creativelayers.net/themes/upskill-html/images/avatar/review-1.png" alt="Author" className="w-20 h-20 rounded-full" />
                    </div>
                </div>

                {/* Entry Meta */}
                <ul className="entry-meta flex mt-4 mb-4">
                    <li>
                        <div className="ratings flex items-center gap-2">
                            <div className="number">4.9</div>
                            <div className="stars flex items-center">
                                {[...Array(4)].map((_, i) => (
                                    <i key={i} className="icon-star-1 text-yellow-400"></i>
                                ))}
                                <svg width="12" height="11" viewBox="0 0 12 11" className="text-yellow-400">
                                    <path d="M3.54831 7.10382L3.58894 6.85477L3.41273 6.67416L1.16841 4.37373L4.24914 3.90314L4.51288 3.86286L4.62625 3.62134L5.99989 0.694982L7.37398 3.62182L7.48735 3.86332L7.75108 3.9036L10.8318 4.37419L8.58749 6.67462L8.41128 6.85523L8.4519 7.10428L8.98079 10.3465L6.24201 8.8325L6.00014 8.69879L5.75826 8.83247L3.01941 10.3461L3.54831 7.10382ZM11.0444 4.15626L11.0442 4.15651L11.0444 4.15626Z" stroke="#131836"></path>
                                </svg>
                            </div>
                            <div className="total">315,475 rating</div>
                        </div>
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="flaticon-user"></i>
                        <span>12k Enrolled Students</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="flaticon-play-1"></i>
                        <span>25 Courses</span>
                    </li>
                </ul>
            </Banner>
        </div>
    );
}