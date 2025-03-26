import * as React from "react";

interface StudentResultItemProps {
    imageUrl: string;
    name: string;
    score: string;
    attempts: string;
    finishTime: string;
}

export const StudentResultItem: React.FC<StudentResultItemProps> = ({
    // imageUrl,
    name,
    score,
    attempts,
    finishTime,
}) => {
    return (
        <article className="grid grid-cols-10 items-center gap-4 py-4 px-6 w-full text-base text-slate-900 border-b border-gray-200 max-md:grid-cols-1 max-md:gap-2 max-md:px-4">
            <div className="col-span-3 flex items-center gap-4">
                {/* <Image
                    src={imageUrl}
                    alt={`${name}'s profile`}
                    className="rounded-full object-cover w-12 h-12"
                /> */}
                <p className="font-medium truncate">{name}</p>
            </div>

            <div className="col-span-1 text-center max-md:text-left">
                {score}
            </div>

            <div className="col-span-2 text-center max-md:text-left">
                {attempts}
            </div>

            <div className="col-span-4 text-right max-md:text-left">
                {finishTime}
            </div>
        </article>
    );
};
