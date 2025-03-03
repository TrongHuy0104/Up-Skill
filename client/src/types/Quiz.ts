export interface Question {
    _id: string; // ObjectId nếu dùng Mongoose, hoặc string nếu dùng JSON
    text: string; // Nội dung câu hỏi
    type: string; // Loại câu hỏi (ví dụ: "short-answer", "multiple-choice", "true/false")
    points: number; // Số điểm của câu hỏi
    correctAnswer: string; // Câu trả lời đúng
    options: string[];
}

export interface Quizzes {
    _id: string;
}
