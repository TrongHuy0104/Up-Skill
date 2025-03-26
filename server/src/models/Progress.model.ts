import { IProgress } from '@/interfaces/Progress';
import mongoose, { Schema } from 'mongoose';

// Schema của Progress
const ProgressSchema = new Schema<IProgress>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },

        totalLessons: {
            type: Number,
            required: true
        },
        totalCompleted: {
            type: Number,
            required: true,
            default: 0
        },
        completedLessons: [
            {
                section: {
                    name: { type: String },
                    sectionLength: { type: Number },
                    sectionOrder: { type: Number },
                    lessons: [
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'Lesson'
                        }
                    ],
                    totalCompletedPerSection: {
                        type: Number,
                        default: function (this: any) {
                            return this.lessons ? this.lessons.length : 0;
                        }
                    }
                }
            }
        ],
        completedQuizzes: [
            {
                section: {
                    isCompleted: { type: Boolean, default: false },
                    quizzes: [
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'Quiz'
                        }
                    ]
                }
            }
        ]
    },
    { timestamps: true }
);

// Middleware để cập nhật totalCompleted tự động
ProgressSchema.pre('save', function (next) {
    const completedLessonsCount = this.completedLessons.reduce((total, section) => {
        return total + (section.section.lessons?.length || 0);
    }, 0);
    const completedQuizzesCount = this.completedQuizzes.reduce((total, section) => {
        // Kiểm tra xem quiz trong section có được hoàn thành hay không
        if (section.section.isCompleted) {
            return total + 1;
        }
        return total;
    }, 0);

    // Cập nhật giá trị totalCompleted
    this.totalCompleted = completedLessonsCount + completedQuizzesCount;
    next();
});

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
