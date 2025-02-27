'use client';

import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface InstructorSidebarProps {
    address: string;
    email: string;
    phoneNumber: string;
    socialLinks: {
        twitter: string;
        facebook: string;
        instagram: string;
        linkedIn: string;
    };
}

const InstructorSidebar: React.FC<InstructorSidebarProps> = ({ address, email, phoneNumber, socialLinks }) => {
    const { facebook, twitter, instagram, linkedIn } = socialLinks;
    return (
        <div className="w-[400px] rounded-2xl bg-primary-50 border p-4">
            <div className="relative w-full h-[360px] flex justify-center items-center">
                <Image
                    src="/assets/images/instructors/instructors-03.jpg"
                    alt="Instructor Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>
            <div className="px-5 py-8 border-b">
                <div className="flex justify-between items-center mb-[25px]">
                    <p className="text-[18px] text-left font-medium">Contact Me</p>
                </div>
                <div className="space-y-4 text-sm">
                    <a href="#" className="text-[15px] text-primary-800 flex items-center gap-2 hover:text-[#E27447]">
                        <Image src="/assets/icons/location.svg" alt="Play-Outline Icon" width={16} height={16} />
                        {address}
                    </a>
                    <a href="#" className="text-[15px] text-primary-800 flex items-center gap-2 hover:text-[#E27447]">
                        <Image src="/assets/icons/mail.svg" alt="Timetable Icon" width={16} height={16} />
                        {email}
                    </a>
                    <a href="#" className="text-[15px] text-primary-800 flex items-center gap-2 hover:text-[#E27447]">
                        <Image src="/assets/icons/phone.svg" alt="Arrow-Down Icon" width={16} height={16} />
                        {phoneNumber}
                    </a>
                </div>
            </div>
            <div className="text-center mt-6">
                <p className="text-[16px] font-medium text-primary-800">Follow me</p>
                <div className="flex justify-center gap-4 mt-4 mb-4">
                    <a
                        href={facebook}
                        className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-#E27447] text-sm"
                    >
                        <FaFacebookF />
                    </a>
                    <a
                        href={twitter}
                        className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-#E27447] text-sm"
                    >
                        <FaXTwitter />
                    </a>
                    <a
                        href={instagram}
                        className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-#E27447] text-sm"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href={linkedIn}
                        className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-#E27447] text-sm"
                    >
                        <FaLinkedinIn />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InstructorSidebar;
