import Image from 'next/image';

interface CourseInfoItemProps {
    readonly icon: string;
    readonly text: string;
    readonly isLast?: boolean;
}
export default function CourseInfoItem({ icon, text, isLast }: CourseInfoItemProps) {
    return (
        <div className="flex items-center gap-[10px]">
            <Image src={icon} alt={text} />
            <p className="font-normal text-[12px] leading-7 text-[#585d69]">{text}</p>
            {!isLast && <span className="text-[#e4e4e7] after:top-[-9px]">|</span>}
        </div>
    );
}
