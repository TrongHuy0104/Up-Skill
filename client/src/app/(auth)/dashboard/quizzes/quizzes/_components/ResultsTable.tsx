import * as React from "react";
import { StudentResultItem } from "./StudentResultItem";

interface ResultsTableProps {
    students?: Array<{
        imageUrl: string;
        name: string;
        score: string;
        attempts: string;
        finishTime: string;
    }>;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ students = [] }) => {
    return (
        <section className="w-full">
            <header className="grid grid-cols-10 gap-4 py-4 px-6 bg-accent-100 rounded-t-2xl text-base font-semibold text-slate-900 max-md:grid-cols-1 max-md:gap-2 max-md:px-4">
                <div className="col-span-3">Students</div>
                <div className="col-span-1 text-center max-md:text-left">Score</div>
                <div className="col-span-2 text-center max-md:text-left">Attempt</div>
                <div className="col-span-4 text-right max-md:text-left">Finishing time</div>
            </header>

            <main className="bg-white rounded-b-2xl">
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <StudentResultItem key={index} {...student} />
                    ))
                ) : (
                    <p className="text-center py-5 text-gray-500">No student results available</p>
                )}
            </main>
        </section>
    );
};
