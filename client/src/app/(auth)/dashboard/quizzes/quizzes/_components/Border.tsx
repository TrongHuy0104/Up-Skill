import * as React from "react";
import { ResultsTable } from "./ResultsTable";

interface BorderProps {
    students?: Array<{
        imageUrl: string;
        name: string;
        score: string;
        attempts: string;
        finishTime: string;
    }>;
}

export default function Border({ students }: BorderProps) {
    return (
        <section className="px-10 py-9 font-medium rounded-xl border border-solid border-zinc-200 max-md:px-5">
            <ResultsTable students={students} />
        </section>
    );
};
