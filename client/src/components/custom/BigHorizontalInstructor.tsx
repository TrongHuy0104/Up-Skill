import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import star from '@/public/assets/icons/star.svg';
import student from '@/public/assets/icons/students.svg';
import play from '@/public/assets/icons/play.svg';
import { FaXTwitter } from 'react-icons/fa6';

interface Instructor {
    name: string;
    profession: string;
    avatar: any;
    rating: number;
    reviews: number;
    students: number;
    courses: number;
    description: string;
}

const InstructorCard = ({ name, profession, avatar, rating, reviews, students, courses, description }: Instructor) => {
    return (
        <div className="flex flex-col sm:flex-row  items-center gap-6   w-full sm:min-w-[375px] sm:max-w[767px] md:min-w-[700px] md:max-w-[900px] mx-auto">
            {/* Avatar */}
            <div className="w-52 h-52 rounded-sm overflow-hidden">
                <Image src={avatar} alt={name || ''} width={210} height={210} objectFit="cover" quality={100} />
            </div>

            {/* Thông tin Instructor */}
            <div className="flex-1 ">
                <h2 className="text-[18px] font-semibold mb-3">{name}</h2>
                <p className="text-gray-500 mb-3">{profession}</p>

                {/* Xếp hạng, học viên, khóa học */}
                <div className="flex items-center text-gray-600 mb-3">
                    <span className="pr-1">{rating.toFixed(1)}</span>
                    <Image src={star} alt="Star Icon" />
                    <span className="mx-4 ">{reviews.toLocaleString()} Reviews</span>
                    <div className="flex mr-4">
                        <Image src={student} alt="Student Icon" />

                        <span className="ml-2 "> {students.toLocaleString()} Students</span>
                    </div>

                    <div className="flex mr-4">
                        <Image src={play} alt="Play Icon" />

                        <span className="ml-2">
                            {courses} Course{courses > 1 && 's'}
                        </span>
                    </div>
                </div>

                {/* Mô tả */}
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{description}</p>

                {/* Mạng xã hội */}
                <div className="flex gap-3 mt-4 mb-4">
                    <a
                        href="#"
                        className="cursor-pointer bg-primary-100 text-primary-800  rounded-full p-2 hover:text-accent-500 text-[12px]"
                    >
                        <FaFacebookF />
                    </a>
                    <a
                        href="#"
                        className="cursor-pointer bg-primary-100 text-primary-800  rounded-full p-2 hover:text-accent-500 text-[12px]"
                    >
                        <FaXTwitter />
                    </a>
                    <a
                        href="#"
                        className="cursor-pointer bg-primary-100 text-primary-800  rounded-full p-2 hover:text-accent-500 text-[12px]"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="#"
                        className="cursor-pointer bg-primary-100 text-primary-800  rounded-full p-2 hover:text-accent-500 text-[12px]"
                    >
                        <FaLinkedinIn />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InstructorCard;
