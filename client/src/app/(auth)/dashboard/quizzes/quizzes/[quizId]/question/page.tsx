// import React from 'react';
// import Question from './_components/Question';
// import { cookies } from 'next/headers';

// export default async function page({ params }: any) {
//     const { id } = await params;
//     const cookieStore = await cookies();
//     const cookie = cookieStore.toString();

//     // Gửi request lấy thông tin user
//     const res = await fetch(`http://localhost:8000/api/quizzes/${id}/questions`, {
//         credentials: 'include',
//         headers: {
//             Cookie: cookie // Pass the cookies in the headers
//         }
//     });

//     const questions = await res.json();
//     console.log('questions', questions);

//     return (
//         <div className="container mx-auto p-6">
//             ss <Question questions={questions} />{' '}
//         </div>
//     );
// }
import React from 'react';

export default function page() {
    return <div>pagequestions</div>;
}
