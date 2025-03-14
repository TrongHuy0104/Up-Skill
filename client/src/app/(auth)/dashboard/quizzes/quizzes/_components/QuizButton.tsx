import Link from "next/link";
import * as React from "react";

const QuizButton: React.FC = () => {
    return (
        <div className="border rounded-xl">
            <button className="flex gap-3 self-start text-base leading-loose p-1 px-3">
                <Link href="/dashboard/quizzes/create-quiz">Add New Quiz</Link>
            </button>
        </div>

    );
};

export default QuizButton;
