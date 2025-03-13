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

    if (!progress) {
        return res.status(200).json({
            success: true,
            message: 'No progress found, returning empty progress.',
            data: {
                user: userId,
                course: courseId,
                totalLessons: course.courseData.length,
                totalCompleted: 0,
                completedLessons: []
            }
        });
    }

    res.status(200).json({
        success: true,
        message: 'Progress data retrieved successfully',
        data: progress
    });
});
