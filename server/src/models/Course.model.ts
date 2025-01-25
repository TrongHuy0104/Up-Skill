import mongoose, { Schema } from 'mongoose';
import { IComment, ICourse, ICourseData, ILink, IReview } from '@/interfaces/Course';

const ReviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentReplies: [Object]
});

const LinkSchema = new Schema<ILink>({
    title: String,
    url: String
});

const CommentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
});

const CourseDataSchema = new Schema<ICourseData>({
    title: String,
    description: String,
    videoUrl: String,
    videoPlayer: String,
    links: [LinkSchema],
    suggestion: String,
    questions: [CommentSchema]
});

const CourseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    price: {
        type: Number,
        required: true
    },
    estimatedPrice: {
        type: Number
    },
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [ReviewSchema],
    courseData: [CourseDataSchema],
    rating: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
