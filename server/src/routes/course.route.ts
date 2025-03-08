import express from 'express';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { authorizeRoles } from '@/middlewares/auth/authorizeRoles';
import {
    addAnswer,
    addQuestion,
    addReplyToReview,
    addReview,
    deleteCourse,
    generateVideoUrl,
    getAllCourses,
    getAllCoursesWithoutPurchase,
    getCoursesLimitWithPagination,
    getPurchasedCourseByUser,
    getSingleCourse,
    getTopCourses,
    updateCourse,
    uploadCourse,
    getCourseStatistics,
    searchCoursesAndInstructors
} from '@/controllers/course.controller';
import { updateAccessToken } from '@/controllers/user.controller';

const router = express.Router();

router.post('/create-course', updateAccessToken, isAuthenticated, uploadCourse);

router.put('/update-course/:id', updateAccessToken, isAuthenticated, updateCourse);

router.get('/pagination', getCoursesLimitWithPagination);

router.get('/count', getCourseStatistics);

router.post('/search', searchCoursesAndInstructors);

router.get('/top-courses', getTopCourses);

router.get('/:id', getSingleCourse);

router.get('/', getAllCoursesWithoutPurchase);

router.get('/purchased/:id', updateAccessToken, isAuthenticated, getPurchasedCourseByUser);

router.put('/add-question', updateAccessToken, isAuthenticated, addQuestion);

router.put('/add-answer', updateAccessToken, isAuthenticated, addAnswer);

router.put('/add-review/:id', updateAccessToken, isAuthenticated, addReview);

router.put('/add-reply/:id', updateAccessToken, isAuthenticated, addReplyToReview);

router.get('/get-courses', isAuthenticated, authorizeRoles('admin'), getAllCourses);

router.delete('/delete-course:id', isAuthenticated, authorizeRoles('admin'), deleteCourse);

router.post('/getVdoCipherOTP', generateVideoUrl);

export = router;
