import mongoose, { Schema } from 'mongoose';
import { IComment, ICommentReply, ICourse, ICourseData, ILink, IReview, IReviewReply } from '@/interfaces/Course';

const ReviewReplySchema = new Schema<IReviewReply>(
    {
        user: Object,
        comment: String
    },
    { timestamps: true }
);

const ReviewSchema = new Schema<IReview>(
    {
        user: Object,
        rating: {
            type: Number,
            default: 0
        },
        comment: String,
        commentReplies: [ReviewReplySchema]
    },
    { timestamps: true }
);

const LinkSchema = new Schema<ILink>({
    title: String,
    url: String
});

const CommentReplySchema = new Schema<ICommentReply>(
    {
        user: Object,
        answer: String
    },
    { timestamps: true }
);

const CommentSchema = new Schema<IComment>(
    {
        user: Object,
        question: String,
        questionReplies: [CommentReplySchema]
    },
    { timestamps: true }
);

const CourseDataSchema = new Schema<ICourseData>({
    title: String,
    description: String,
    videoUrl: String,
    videoPlayer: String,
    videoSection: String,
    videoLength: Number,
    links: [LinkSchema],
    suggestion: String,
    questions: [CommentSchema]
});

const CourseSchema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: true
        },
        subTitle: {
            type: String
        },
        description: {
            type: String
            // required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required']
        },
        price: {
            type: Number
            // required: true
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
            type: String
            // required: true
        },
        level: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Level'
        },
        demoUrl: {
            type: String
            // required: true
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
        },
        isPublished: { type: Boolean, default: false },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: [true, 'Sub Category is required']
        }
    },
    { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
