import React, { useEffect, useState } from 'react';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { IoStarSharp, IoStarOutline } from 'react-icons/io5';
import Image from 'next/image';
import { format } from 'date-fns';
import { FaRegMessage } from 'react-icons/fa6';

import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import CoursesDetailInfo from '../../_components/CoursesDetailInfo';
import Avatar from '@/components/ui/Avatar';
import arrowRightIcon from '@/public/assets/icons/arrow-right.svg';
import { toast } from '@/hooks/use-toast';
import {
    useAddAnswerInQuestionMutation,
    useAddNewQuestionMutation,
    useAddReplyInReviewMutation,
    useAddReviewInCourseMutation
} from '@/lib/redux/features/course/courseApi';
import SpinnerMini from '@/components/custom/SpinnerMini';
import VideoPlayer from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/VideoPlayer';
import Ratings from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/Ratings';
import { useUpdateLessonCompletionMutation } from '@/lib/redux/features/progress/progressApi';
import Practice from './Practice';
import { useParams } from 'next/navigation';

type Props = {
    readonly course: any;
    readonly user: any;
    activeVideo: { section: string; index: number }; // Tracked as { section, index }
    setActiveVideo(value: { section: string; index: number }): void;

    readonly refetch: any;
    readonly reload: any;
    readonly progressData: any;
    readonly selectedQuizId: string | null;
    readonly quizQuestions: any[];
    setSelectedQuizId: (quizId: string | null) => void; // Thêm vào props
    setQuizQuestions: (questions: any[]) => void;
};

function CourseContentMedia({
    course,
    user,
    activeVideo,
    setActiveVideo,
    progressData,
    refetch,
    reload,
    selectedQuizId,
    quizQuestions,
    setSelectedQuizId,
    setQuizQuestions
}: Props) {
    const content = course?.courseData;
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionId, setQuestionId] = useState('');
    const [reviewId, setReviewId] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [isReviewReply, setIsReviewReply] = useState(false);
    const [reviewReply, setReviewReply] = useState('');
    const [videoProgress, setVideoProgress] = useState(0);
    const { courseId } = useParams();

    // const handleQuizCompletion = async (quizId: string, userAnswers: any[], correctAnswers: any[]) => {
    //     const correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;
    //     const totalQuestions = correctAnswers.length;
    //     const percentage = (correctCount / totalQuestions) * 100;

    //     if (percentage >= 70) {
    //         // Cập nhật trạng thái quiz đã hoàn thành
    //         await updateQuizCompletion({
    //             courseId: course?._id,
    //             quizId: quizId,
    //             isCompleted: true
    //         }).unwrap();

    //         // Cập nhật danh sách bài học hoàn thành
    //         setCompletedLessons([...completedLessons, quizId]);
    //         toast({
    //             variant: 'success',
    //             title: `You passed the quiz with ${correctCount} out of ${totalQuestions} correct answers!`
    //         });

    //         // Khi quiz đã hoàn thành, bạn có thể tự động chuyển qua video hoặc quiz tiếp theo
    //         setActiveVideo(activeVideo + 1); // Chuyển qua video tiếp theo hoặc quiz tiếp theo
    //     } else {
    //         toast({
    //             variant: 'destructive',
    //             title: `You need to get at least 70% correct answers to pass the quiz.`
    //         });
    //     }
    // };

    // Cập nhật danh sách bài học hoàn thành từ `progressData`
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    const [addNewQuestion, { isSuccess, error, isLoading: isCreateQuestionLoading }] = useAddNewQuestionMutation();
    const [addAnswerInQuestion, { isSuccess: isAnswerSuccess, error: answerError, isLoading: isAddAnswerLoading }] =
        useAddAnswerInQuestionMutation();
    const [
        addReplyInReview,
        { isSuccess: isReplyReviewSuccess, error: replyReviewError, isLoading: isReplyReviewLoading }
    ] = useAddReplyInReviewMutation();
    const [
        addReviewInCourse,
        { isSuccess: isAddReviewSuccess, error: addReviewError, isLoading: isAddReviewLoading, reset }
    ] = useAddReviewInCourseMutation();

    const [updateLessonCompletion] = useUpdateLessonCompletionMutation();

    const isReviewExists = course?.reviews?.find((item: any) => item.user._id === user._id);

    const onSubmitQuestion = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (question.trim().length === 0) {
            toast({
                variant: 'destructive',
                title: 'Question can not be empty.'
            });
        } else {
            addNewQuestion({ question, contentId: content?.[activeVideo?.index]._id, courseId: course?._id });
        }
    };

    const handleAnswerSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (answer.trim().length === 0) {
            setAnswer('');
            toast({
                variant: 'destructive',
                title: 'Question reply can not be empty.'
            });
        } else {
            addAnswerInQuestion({
                answer,
                questionId,
                contentId: content?.[activeVideo?.index]._id,
                courseId: course?._id
            });
        }
    };

    const onSubmitReview = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (review.trim().length === 0) {
            toast({
                variant: 'destructive',
                title: 'Review can not be empty.'
            });
        } else if (rating === 0) {
            toast({
                variant: 'destructive',
                title: 'Please rating the course.'
            });
        } else {
            addReviewInCourse({ review, rating, courseId: course?._id });
        }
    };

    const handleReviewReply = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (reviewReply.trim().length === 0) {
            toast({
                variant: 'destructive',
                title: 'Review can not be empty.'
            });
        } else {
            addReplyInReview({ comment: reviewReply, reviewId, courseId: course?._id });
        }
    };

    useEffect(() => {
        const completedLessonIds =
            progressData?.completedLessons?.flatMap((section: any) =>
                section.section.lessons.map((lesson: any) => lesson.toString())
            ) || [];
        setCompletedLessons(completedLessonIds);
    }, [progressData]);

    const isCurrentLessonCompleted =
        content && activeVideo !== null && content[activeVideo?.index]
            ? completedLessons.includes(content[activeVideo?.index]._id)
            : false;

    const completedQuizIds = progressData?.completedQuizzes?.length
        ? progressData.completedQuizzes.flatMap((section: any) =>
              section.section.quizzes.map((quiz: any) => quiz.toString())
          )
        : [];

    const isCurrentQuizCompleted = selectedQuizId ? completedQuizIds.includes(selectedQuizId) : false;
    // Enable "Next Lesson" button if:
    // 1. Lesson is already completed OR
    // 2. Video progress reaches 80%
    const canProceedToNext = isCurrentLessonCompleted || videoProgress >= 80 || isCurrentQuizCompleted;

    const handleVideoProgress = async (progress: number) => {
        setVideoProgress(progress);

        // Auto-mark lesson as completed when 80% is watched
        if (progress >= 80 && !isCurrentLessonCompleted) {
            try {
                await updateLessonCompletion({
                    courseId: course?._id,
                    lessonId: content[activeVideo?.index]._id,
                    isCompleted: true
                }).unwrap();

                // Update completed lessons
                setCompletedLessons([...completedLessons, content[activeVideo?.index]._id]);
                await reload();
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: `Unable to update lesson status, ${error}`
                });
            }
        }
    };

    // const videoSections = [...new Set(content?.map((item: any) => item.videoSection))];

    // const handleNextLesson = () => {
    //     const currentVideoIndex = typeof activeVideo === 'number' ? activeVideo : Number(activeVideo);
    //     console.log('currentVideoIndex', currentVideoIndex);

    //     // Kiểm tra xem bài học hiện tại có phải là quiz hay không
    //     const isCurrentLessonQuiz = content[currentVideoIndex]?.quizzes?.length > 0;
    //     console.log('isCurrentLessonQuiz', isCurrentLessonQuiz);

    //     if (isCurrentLessonQuiz) {
    //         // Kiểm tra xem quiz đã được hoàn thành hay chưa
    //         const quizCompleted = content[currentVideoIndex].quizzes.every((quiz: any) => quiz.isCompleted);
    //         console.log('quizCompleted', quizCompleted);

    //         if (quizCompleted) {
    //             // Nếu quiz đã được hoàn thành, chuyển sang bài học đầu tiên của section tiếp theo
    //             const currentSection = content[currentVideoIndex].videoSection;
    //             const nextSection = videoSections[videoSections.indexOf(currentSection) + 1];

    //             if (nextSection) {
    //                 console.log('nextSection', nextSection);

    //                 const nextSectionFirstLessonIndex = content.findIndex(
    //                     (item: any) => item.videoSection === nextSection
    //                 );
    //                 console.log('nextSectionFirstLessonIndex', nextSectionFirstLessonIndex);

    //                 if (nextSectionFirstLessonIndex !== -1) {
    //                     console.log('Bài học đầu section mới:', content[nextSectionFirstLessonIndex]);
    //                     console.log('Bài học đầu section mớiiiiiiiiiiiiii:', nextSectionFirstLessonIndex);

    //                     setActiveVideo(nextSectionFirstLessonIndex);
    //                     setVideoProgress(0);

    //                     // Kiểm tra xem bài học đầu tiên của section tiếp theo có phải là quiz hay không
    //                     const nextLesson = content[nextSectionFirstLessonIndex];
    //                     if (nextLesson?.quizzes?.length > 0) {
    //                         setActiveVideo(currentVideoIndex + 1);
    //                         setVideoProgress(0);
    //                         setSelectedQuizId(nextLesson.quizzes[0]._id); // Cập nhật quiz hiện tại
    //                         setQuizQuestions(nextLesson.quizzes[0].questions); // Cập nhật câu hỏi
    //                     } else {
    //                         setActiveVideo(currentVideoIndex + 1);
    //                         setVideoProgress(0);
    //                         setSelectedQuizId(null); // Reset quiz hiện tại
    //                         setQuizQuestions([]); // Reset câu hỏi
    //                     }
    //                     return; // Kết thúc hàm
    //                 }
    //             }
    //         }
    //     }

    //     // Nếu không phải quiz hoặc quiz chưa được hoàn thành, chuyển sang bài học tiếp theo
    //     if (currentVideoIndex < content.length - 1) {
    //         const nextLesson = content[currentVideoIndex + 1];
    //         setActiveVideo(currentVideoIndex + 1);
    //         setVideoProgress(0);
    //         console.log('nextLesson', nextLesson);

    //         // Kiểm tra xem bài học tiếp theo có phải là quiz hay không
    //         if (nextLesson?.quizzes?.length > 0) {
    //             setSelectedQuizId(nextLesson.quizzes[0]._id); // Cập nhật quiz hiện tại
    //             setQuizQuestions(nextLesson.quizzes[0].questions); // Cập nhật câu hỏi
    //         } else {
    //             setSelectedQuizId(null); // Reset quiz hiện tại
    //             setQuizQuestions([]); // Reset câu hỏi
    //         }
    //     }
    // };

    const handleNextLesson = () => {
        if (activeVideo && activeVideo.index < content.length - 1) {
            const nextLesson = content[activeVideo.index + 1];
            console.log('nextLesson', nextLesson);
            console.log('activeVideo.index', activeVideo.index);

            // Kiểm tra xem bài học tiếp theo có phải là quiz hay không
            if (nextLesson?.quizzes?.length > 0) {
                setSelectedQuizId(nextLesson.quizzes[0]._id); // Cập nhật quiz hiện tại
                setQuizQuestions(nextLesson.quizzes[0].questions); // Cập nhật câu hỏi
            } else {
                setActiveVideo({ section: nextLesson.videoSection, index: activeVideo.index + 1 });
                setVideoProgress(0);
                setSelectedQuizId(null); // Reset quiz hiện tại
                setQuizQuestions([]); // Reset câu hỏi
            }

            console.log('section', nextLesson.videoSection);
            console.log('section', activeVideo.index + 1);

            // Chuyển sang bài học tiếp theo
            setActiveVideo({ section: nextLesson.videoSection, index: activeVideo.index + 1 });
            setVideoProgress(0);
        }
    };

    // const handleNextLesson = () => {
    //     if (activeVideo < content.length - 1) {
    //         setActiveVideo(activeVideo + 1);
    //         setVideoProgress(0);
    //     }
    // };
    useEffect(() => {
        if (isSuccess) {
            setQuestion('');
            refetch();
            toast({
                variant: 'success',
                title: 'Question create successfully.'
            });
        }
        if (isAnswerSuccess) {
            setAnswer('');
            refetch();
            toast({
                variant: 'success',
                title: 'Question reply create successfully.'
            });
        }
        if (isAddReviewSuccess) {
            setReview('');
            setRating(0);
            refetch();
            reset();
            toast({
                variant: 'success',
                title: 'Review create successfully.'
            });
        }
        if (isReplyReviewSuccess) {
            setReviewReply('');
            refetch();
            toast({
                variant: 'success',
                title: 'Reply Review create successfully.'
            });
        }
        if (error) {
            if ('data' in error) {
                const errorMessage = error as any;
                toast({
                    variant: 'destructive',
                    title: errorMessage.data.message
                });
            }
        }
        if (answerError) {
            if ('data' in answerError) {
                const errorMessage = answerError as any;
                toast({
                    variant: 'destructive',
                    title: errorMessage.data.message
                });
            }
        }
        if (addReviewError) {
            if ('data' in addReviewError) {
                const errorMessage = addReviewError as any;
                toast({
                    variant: 'destructive',
                    title: errorMessage.data.message
                });
            }
        }
        if (replyReviewError) {
            if ('data' in replyReviewError) {
                const errorMessage = addReviewError as any;
                toast({
                    variant: 'destructive',
                    title: errorMessage.data.message
                });
            }
        }
    }, [
        isSuccess,
        error,
        refetch,
        answerError,
        isAnswerSuccess,
        addReviewError,
        review,
        isAddReviewSuccess,
        reset,
        replyReviewError,
        isReplyReviewSuccess
    ]);

    return (
        <div className="w-[95%] md:w-[90%] py-4 m-auto">
            {/* <VideoPlayer videoUrl={content?.[activeVideo]?.videoUrl?.url} onProgress={handleVideoProgress} /> */}
            {/* Kiểm tra xem activeVideo có phải là quizId không */}
            {selectedQuizId ? (
                <Practice
                    questionArr={quizQuestions}
                    quizId={selectedQuizId}
                    courseId={typeof courseId === 'string' ? courseId : ''}
                /> // Hiển thị quiz nếu selectedQuizId có giá trị
            ) : (
                <VideoPlayer
                    videoUrl={content?.[activeVideo?.index]?.videoUrl?.url} // Hiển thị video nếu không phải quiz
                    onProgress={handleVideoProgress} // Gọi xử lý video progress nếu cần
                />
            )}
            <div className="w-full flex items-center justify-between my-5">
                <Button
                    size={'rounded'}
                    className={activeVideo?.index === 0 ? '!cursor-no-drop opacity-80 hover:bg-primary-800' : ''}
                    onClick={() => setActiveVideo({ section: activeVideo?.section, index: activeVideo?.index - 1 })}
                >
                    <HiArrowLeft />
                    Prev Lesson
                </Button>

                {/* Next Lesson Button */}
                <Button
                    size={'rounded'}
                    className={`bg-accent-600 hover:bg-primary-800 ${!canProceedToNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNextLesson}
                    disabled={!canProceedToNext}
                >
                    Next Lesson
                    <HiArrowRight />
                </Button>
            </div>
            <h1 className="pt-3 text-[25px] font-semibold mb-8">{content?.[activeVideo?.index]?.title}</h1>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="q&a">Q&A</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <CoursesDetailInfo
                        benefits={course?.benefits}
                        prerequisites={course?.prerequisites}
                        description={course?.description}
                    />
                </TabsContent>
                <TabsContent value="resources">
                    {content?.[activeVideo?.index]?.links.map((item: any, index: number) => (
                        <div key={item?.title + index} className="mb-5">
                            <h2 className="md:text-lg font-normal md:inline-block">
                                {' '}
                                {item.title && item.title + ' :'}
                            </h2>
                            <a className="inline-block text-[#4395c4] md:text-lg md:pl-2" href={item.url}>
                                {item.url}
                            </a>
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="q&a">
                    <div className="flex w-full">
                        <Avatar size={50} avatar={user?.avatar?.url} />
                        <form
                            className={`space-comment ml-4 relative overflow-hidden transition-all duration-500 ease-in-out opacity-100 w-full max-h-[500px] scale-100`}
                        >
                            <textarea
                                rows={5}
                                className="w-full text-primary-800 text-sm leading-[28px] p-2.5 border border-gray-300 rounded-md resize-none appearance-none outline-none focus:outline-none transition-all duration-300"
                                placeholder="Add a question..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            ></textarea>
                            <button
                                onClick={onSubmitQuestion}
                                disabled={isCreateQuestionLoading}
                                className="absolute flex items-center justify-center h-[50px] w-[50px] cursor-pointer top-[23%] right-[2%] rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white transition-all duration-300 hover:scale-110"
                            >
                                {isCreateQuestionLoading ? (
                                    <SpinnerMini />
                                ) : (
                                    <Image src={arrowRightIcon} alt="arrow right icon" />
                                )}
                            </button>
                        </form>
                        <br />
                        <br />
                    </div>
                    <div>
                        <CommentReply
                            content={content}
                            activeVideo={activeVideo}
                            answer={answer}
                            setAnswer={setAnswer}
                            handleAnswerSubmit={handleAnswerSubmit}
                            setQuestionId={setQuestionId}
                            isAddAnswerLoading={isAddAnswerLoading}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="reviews">
                    <div className="w-full">
                        {!isReviewExists && (
                            <div className="w-[97%] flex">
                                <Avatar size={50} avatar={user?.avatar?.url} />
                                <div className="w-full">
                                    <h5 className="pl-3 text-lg font-medium">
                                        Give a rating <span className="text-red-600">*</span>
                                    </h5>
                                    <div className="flex w-full ml-2 pb-3">
                                        {[1, 2, 3, 4, 5].map((i) =>
                                            rating >= i ? (
                                                <IoStarSharp
                                                    key={i}
                                                    className="ml-1 cursor-pointer"
                                                    color="#f0b510"
                                                    size={18}
                                                    onClick={() => setRating(i)}
                                                />
                                            ) : (
                                                <IoStarOutline
                                                    key={i}
                                                    className="ml-1 cursor-pointer"
                                                    color="#f0b510"
                                                    size={18}
                                                    onClick={() => setRating(i)}
                                                />
                                            )
                                        )}
                                    </div>
                                    <form
                                        className={`space-comment ml-4 relative overflow-hidden transition-all duration-500 ease-in-out opacity-100 w-full max-h-[500px] scale-100`}
                                    >
                                        <textarea
                                            rows={5}
                                            className="w-full text-primary-800 text-sm leading-[28px] p-2.5 border border-gray-300 rounded-md resize-none appearance-none outline-none focus:outline-none transition-all duration-300"
                                            placeholder="Add a review..."
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                        ></textarea>
                                        <button
                                            onClick={onSubmitReview}
                                            disabled={isAddReviewLoading}
                                            className="absolute flex items-center justify-center h-[50px] w-[50px] cursor-pointer top-[23%] right-[2%] rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white transition-all duration-300 hover:scale-110"
                                        >
                                            {isAddReviewLoading ? (
                                                <SpinnerMini />
                                            ) : (
                                                <Image src={arrowRightIcon} alt="arrow right icon" />
                                            )}
                                        </button>
                                    </form>
                                    <br />
                                    <br />
                                </div>
                            </div>
                        )}
                        <div className="w-full">
                            {course?.reviews
                                ? [...course.reviews].reverse().map((item: any, index: number) => (
                                      <>
                                          <div className="w-full flex mt-5 mb-2" key={item?._id + index}>
                                              <Avatar size={50} avatar={item?.user?.avatar?.url} />
                                              <div className="w-full">
                                                  <h5 className="pl-3 text-lg font-medium">{item?.user?.name}</h5>
                                                  <div className="ml-[10px]">
                                                      <Ratings rating={item.rating} style={{ marginRight: '2px' }} />
                                                  </div>
                                                  <p className="pl-3">{item?.comment}</p>
                                                  <small className="pl-3 text-primary-500">
                                                      {format(new Date(item?.createdAt), 'hh:mm-MM/dd/yyyy')}
                                                  </small>
                                              </div>
                                          </div>
                                          {user?._id === course?.authorId && (
                                              <div className="w-full flex">
                                                  <button
                                                      className="md:pl-[60px] cursor-pointer mr-2"
                                                      onClick={() => {
                                                          setIsReviewReply(!isReviewReply);
                                                          setReviewId(item._id);
                                                      }}
                                                  >
                                                      {!isReviewReply ? 'Add a reply' : 'Hide replies'}
                                                  </button>
                                              </div>
                                          )}
                                          {isReviewReply && (
                                              <div className="w-full flex relative">
                                                  <input
                                                      type="text"
                                                      placeholder="Enter your answer..."
                                                      value={reviewReply}
                                                      onChange={(e) => setReviewReply(e.target.value)}
                                                      className="block md:ml-[54px] w-[85%] mt-2 outline-none bg-transparent border-b border-primary-200 p-[5px] w[[95%]"
                                                  />
                                                  <button
                                                      onClick={handleReviewReply}
                                                      className="absolute right-[16px] bottom-1 flex items-center justify-center h-[50px] w-[50px] 
                                                    cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white transition-all 
                                                    duration-300 hover:scale-110"
                                                      disabled={isReplyReviewLoading}
                                                  >
                                                      {isReplyReviewLoading ? (
                                                          <SpinnerMini />
                                                      ) : (
                                                          <Image src={arrowRightIcon} alt="arrow right icon" />
                                                      )}
                                                  </button>
                                              </div>
                                          )}

                                          {item?.commentReplies.map((i: any, index: number) => (
                                              <div className="w-full flex md:ml-[56px] mb-2 mt-4" key={i?._id + index}>
                                                  <Avatar size={50} avatar={item?.user?.avatar?.url} />
                                                  <div className="w-full">
                                                      <h5 className="pl-3 text-lg font-medium">{item?.user?.name}</h5>
                                                      <p className="pl-3">{i?.comment}</p>
                                                      <small className="pl-3 text-primary-500">
                                                          {format(new Date(item?.createdAt), 'hh:mm-MM/dd/yyyy')}
                                                      </small>
                                                  </div>
                                              </div>
                                          ))}
                                      </>
                                  ))
                                : null}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default CourseContentMedia;

const CommentReply = ({
    content,
    activeVideo,
    answer,
    setAnswer,
    handleAnswerSubmit,
    setQuestionId,
    isAddAnswerLoading
}: any) => {
    return (
        <div className="w-full my-3">
            {content[activeVideo].questions.map((item: any, index: number) => (
                <CommentItem
                    key={index + item?._id}
                    item={item}
                    answer={answer}
                    setAnswer={setAnswer}
                    setQuestionId={setQuestionId}
                    handleAnswerSubmit={handleAnswerSubmit}
                    isAddAnswerLoading={isAddAnswerLoading}
                />
            ))}
        </div>
    );
};

const CommentItem = ({ item, answer, setAnswer, handleAnswerSubmit, setQuestionId, isAddAnswerLoading }: any) => {
    const [replyActive, setReplyActive] = useState(false);
    return (
        <div className="my-4">
            <div className="flex mb-2">
                <Avatar size={50} avatar={item?.user?.avatar?.url} />
                <div className="w-full">
                    <h5 className="pl-3 text-lg font-medium">{item?.user?.name}</h5>
                    <p className="pl-3">{item?.question}</p>
                    <small className="pl-3 text-primary-500">
                        {format(new Date(item?.createdAt), 'hh:mm-MM/dd/yyyy')}
                    </small>
                </div>
            </div>
            <div className="w-full flex">
                <button
                    className="md:pl-[60px] cursor-pointer mr-2"
                    onClick={() => {
                        setReplyActive(!replyActive);
                        setQuestionId(item?._id);
                    }}
                >
                    {!replyActive
                        ? item?.questionReplies.length !== 0
                            ? 'All replies'
                            : 'Add a reply'
                        : 'Hide replies'}
                </button>
                <FaRegMessage size={18} className="cursor-pointer relative top-[1px]" />
                <span className="pl-1 cursor-pointer">{item?.questionReplies.length}</span>
            </div>

            {replyActive && (
                <>
                    {item?.questionReplies.map((item: any, index: number) => (
                        <div key={item?._id + index} className="w-full md:ml-16 flex my-5">
                            <Avatar size={50} avatar={item?.user?.avatar?.url} />
                            <div className="w-full">
                                <h5 className="pl-3 text-lg font-medium">{item?.user?.name}</h5>
                                <p className="pl-3">{item?.answer}</p>
                                <small className="pl-3 text-primary-500">
                                    {format(new Date(item?.createdAt), 'hh:mm-MM/dd/yyyy')}
                                </small>
                            </div>
                        </div>
                    ))}
                    <div className="w-full flex relative">
                        <input
                            type="text"
                            placeholder="Enter your answer..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="block md:ml-[54px] w-[85%] mt-2 outline-none bg-transparent border-b border-primary-200 p-[5px] w[[95%]"
                        />
                        <button
                            onClick={handleAnswerSubmit}
                            className="absolute right-[16px] bottom-1 flex items-center justify-center h-[50px] w-[50px] 
                            cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white transition-all duration-300 hover:scale-110"
                            disabled={isAddAnswerLoading}
                        >
                            {isAddAnswerLoading ? (
                                <SpinnerMini />
                            ) : (
                                <Image src={arrowRightIcon} alt="arrow right icon" />
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
