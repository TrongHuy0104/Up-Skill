// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/Button'; // Import Button từ component của bạn
// import Image from 'next/image';
// import arrowRight from '@/public/assets/icons/arrow-top-right.svg'; // Import ảnh từ public
// import type { Question } from '@/types/Quiz';

// interface Props {
//     readonly questions: Question[];
// }

// export default function Question({ questions }: Props) {
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [selectedOption, setSelectedOption] = useState<string | null>(null);

//     const currentQuestion = questions[currentQuestionIndex];
//     const isLastQuestion = currentQuestionIndex === questions.length - 1;

//     const handleSelectOption = (option: string) => {
//         setSelectedOption(option);
//     };

//     const handleNext = () => {
//         if (selectedOption) {
//             // Kiểm tra câu trả lời đúng (nếu cần)
//             if (selectedOption === currentQuestion.correctAnswer) {
//                 alert('Correct answer!');
//             } else {
//                 alert('Wrong answer!');
//             }

//             // Reset selectedOption và chuyển sang câu hỏi tiếp theo
//             setSelectedOption(null);
//             if (!isLastQuestion) {
//                 setCurrentQuestionIndex(currentQuestionIndex + 1);
//             } else {
//                 alert('Quiz finished!');
//             }
//         } else {
//             alert('Please select an option!');
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
//             <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                     <Button
//                         key={index}
//                         variant={selectedOption === option ? 'primary' : 'outline'}
//                         size="lg"
//                         className="w-full justify-start"
//                         onClick={() => handleSelectOption(option)}
//                     >
//                         {option}
//                     </Button>
//                 ))}
//             </div>
//             <div className="mt-6 flex justify-end">
//                 <Button
//                     variant="default"
//                     size="lg"
//                     onClick={handleNext}
//                     disabled={!selectedOption} // Disable nút "Next" nếu chưa chọn câu trả lời
//                 >
//                     {isLastQuestion ? 'Finish' : 'Next'}
//                     <Image src={arrowRight} alt="Arrow Right" />
//                 </Button>
//             </div>
//         </div>
//     );
// }
import React from 'react';
import type { Question } from '@/types/Quiz';

interface Props {
    readonly questions: Question[];
}
export default function Question({ questions }: Props) {
    console.log('questions', questions);

    return <div>Question lo</div>;
}
