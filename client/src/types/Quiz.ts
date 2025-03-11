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

export interface IQuestion {
    questionId: string;
    text: string;
    type: 'multiple-choice' | 'true/false' | 'short-answer';
    points: number;
    options?: string[];
    correctAnswer: string | number;
}

export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    duration: number;
    passingScore: number;
    maxAttempts: number;
    isPublished: boolean;
    instructorId: string;
    questions: IQuestion[];
    order: number;
    videoSection: string;
    courseId: string;
    userScores?: {
        user: {
            _id: string;
            name: string;
            email: string;
        }[];
        score: number;
        attemptedAt: Date;
    };
    userDetails?: {
        _id: string;
        name: string;
        email: string;
    }
}

export interface IUserScore {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    score: number;
    attemptedAt: Date;
}
