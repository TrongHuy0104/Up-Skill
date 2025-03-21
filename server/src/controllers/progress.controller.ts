import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import ErrorHandler from '@/utils/ErrorHandler';
import ProgressModel from '@/models/Progress.model';
import CourseModel from '@/models/Course.model';
import { redis } from '@/utils/redis';

// Update lesson completion status via Progress model
export const updateLessonCompletionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id; // Lấy userId từ middleware xác thực
    const courseId = req.params.id;
    const { lessonId, isCompleted } = req.body;

    if (!courseId || !lessonId) {
        return next(new ErrorHandler('Course ID and Lesson ID are required', 400));
    }

    // Tìm khóa học để kiểm tra lesson có tồn tại không
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    // Kiểm tra xem bài học thuộc section nào trong courseData
    let sectionName: string | null = null;
    for (const section of course.courseData) {
        if (section._id.toString() === lessonId) {
            sectionName = section.videoSection;
            break;
        }
    }

    if (!sectionName) {
        return next(new ErrorHandler('Lesson not found in course', 404));
    }

    // Kiểm tra xem Progress của user đã tồn tại chưa, nếu chưa thì tạo mới
    let progress = await ProgressModel.findOne({ user: userId, course: courseId });

    if (!progress) {
        progress = new ProgressModel({
            user: userId,
            course: courseId,
            totalLessons: course.courseData.length,
            totalCompleted: 0,
            completedLessons: []
        });
    }

    // Kiểm tra xem section đã tồn tại trong Progress chưa
    let sectionProgress = progress.completedLessons.find(
        (s: { section: { name: string } }) => s.section.name === sectionName
    );

    if (!sectionProgress) {
        sectionProgress = {
            section: {
                name: sectionName,
                sectionLength: course.courseData.filter((s: { videoSection: string }) => s.videoSection === sectionName)
                    .length,
                lessons: []
            }
        };
        progress.completedLessons.push(sectionProgress);
    }

    // Kiểm tra xem lesson đã tồn tại trong section chưa
    const lessonIndex = sectionProgress.section.lessons.findIndex((l: any) => l.toString() === lessonId);

    if (isCompleted) {
        // Nếu đánh dấu hoàn thành mà bài học chưa có trong danh sách, thì thêm vào
        if (lessonIndex === -1) {
            sectionProgress.section.lessons.push(lessonId);
        }
    } else {
        // Nếu bỏ đánh dấu hoàn thành, thì xóa khỏi danh sách
        if (lessonIndex !== -1) {
            sectionProgress.section.lessons.splice(lessonIndex, 1);
        }
    }

    // Cập nhật tổng số bài học đã hoàn thành trong từng section
    sectionProgress.section.totalCompletedPerSection = sectionProgress.section.lessons.length;

    // Cập nhật tổng số bài học đã hoàn thành trên toàn bộ khóa học
    progress.totalCompleted = progress.completedLessons.reduce(
        (sum: number, sec: { section: { lessons: any[] } }) => sum + sec.section.lessons.length,
        0
    );

    // Lưu vào database
    await progress.save();

    // Cập nhật redis cache
    await redis.set(`progress:${userId}:${courseId}`, JSON.stringify(progress));

    res.status(200).json({
        success: true,
        message: 'Lesson completion status updated successfully',
        data: progress
    });
});

export const updateQuizCompletionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const quizId = req.params.id; // Lấy quizId từ URL
    const { isCompleted, courseId } = req.body; // Lấy trạng thái hoàn thành và courseId từ request body
    const userId = req.user?._id; // Lấy userId từ middleware xác thực

    // Kiểm tra quizId và courseId có tồn tại không
    if (!quizId || !courseId) {
        return next(new ErrorHandler('Quiz ID and Course ID are required', 400));
    }

    // Tìm khóa học
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    // Tìm progress của user trong khóa học này
    const progress = await ProgressModel.findOne({ user: userId, course: courseId });
    if (!progress) {
        return next(new ErrorHandler('Progress not found for the user in this course', 404));
    }

    // Tìm section chứa quiz
    let quizSection = null;
    for (const section of course.courseData) {
        if (section.quizzes && section.quizzes.includes(quizId)) {
            quizSection = section;
            break;
        }
    }

    if (!quizSection) {
        return next(new ErrorHandler('Quiz not found in any section of the course', 404));
    }

    // Kiểm tra xem quiz đã tồn tại trong completedQuizzes chưa
    let quizProgress = progress.completedQuizzes.find(
        (quizProgress: any) => quizProgress.section.quizzes.some((q: any) => q.toString() === quizId.toString()) // So sánh đúng kiểu dữ liệu
    );

    if (!quizProgress) {
        // Nếu quiz chưa có, tạo mới mục quiz trong completedQuizzes
        quizProgress = {
            section: {
                name: quizSection.name,
                isCompleted: false, // Default to false
                quizzes: [quizId]
            }
        };
        progress.completedQuizzes.push(quizProgress);
    }

    // Cập nhật trạng thái hoàn thành của quiz
    quizProgress.section.isCompleted = isCompleted;

    // Cập nhật tổng số quiz đã hoàn thành trong khóa học
    progress.totalCompleted = progress.completedQuizzes.reduce(
        (sum: number, quizProgress: any) => sum + (quizProgress.section.isCompleted ? 1 : 0),
        0
    );

    // Cập nhật lại tổng số quiz hoàn thành trong từng section
    quizSection.totalCompletedPerSection = quizSection.quizzes.reduce((count: number, quizId: any) => {
        const quizItem = progress.completedQuizzes.find(
            (q: any) => q.section.quizzes.includes(quizId) && q.section.isCompleted
        );
        return quizItem ? count + 1 : count;
    }, 0);

    // Lưu vào database
    await progress.save();

    // Cập nhật Redis cache (nếu cần)
    await redis.set(`progress:${userId}:${courseId}`, JSON.stringify(progress));
    console.log('progress', progress);

    res.status(200).json({
        success: true,
        message: 'Quiz completion status updated successfully',
        data: progress // Trả về toàn bộ progress sau khi cập nhật
    });
});

// Get progress data by userId & courseId
export const getProgressData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id; // Lấy userId từ middleware xác thực
    const courseId = req.params.id;

    if (!courseId) {
        return next(new ErrorHandler('Course ID is required', 400));
    }

    // Kiểm tra xem khóa học có tồn tại không
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    // Tìm progress của user trong khóa học này
    const progress = await ProgressModel.findOne({ user: userId, course: courseId });

    // Tính toán phần trăm hoàn thành
    const totalLessons = course.courseData.length;
    const totalCompleted = progress ? progress.totalCompleted : 0;
    const completionPercentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    if (!progress) {
        return res.status(200).json({
            success: true,
            message: 'No progress found, returning empty progress.',
            data: {
                user: userId,
                course: courseId,
                totalLessons,
                totalCompleted,
                completionPercentage,
                completedLessons: [],
                completedQuizzes: []
            }
        });
    }

    res.status(200).json({
        success: true,
        message: 'Progress data retrieved successfully',
        data: {
            ...progress.toObject(),
            completionPercentage
        }
    });
});
