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
    activeVideo: { sectionOrder: number; index: number };
    setActiveVideo(value: { sectionOrder: number; index: number }): void;

    readonly refetch: any;
    readonly reload: any;
    readonly progressData: any;
    readonly selectedQuizId: string | null;
    readonly quizQuestions: any[];
    setSelectedQuizId: (quizId: string | null) => void;
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

    const canProceedToNext = isCurrentLessonCompleted || videoProgress >= 80 || isCurrentQuizCompleted;

    const handleVideoProgress = async (progress: number) => {
        setVideoProgress(progress);

        const currentSectionLessons = content.filter((item: any) => item.sectionOrder === activeVideo.sectionOrder);
        const currentLesson = currentSectionLessons[activeVideo.index];
        const lessonId = currentLesson?._id;

        if (progress >= 80 && lessonId && !completedLessons.includes(lessonId)) {
            try {
                await updateLessonCompletion({
                    courseId: course?._id,
                    lessonId,
                    isCompleted: true,
                    sectionOrder: activeVideo.sectionOrder
                }).unwrap();

                setCompletedLessons([...completedLessons, lessonId]);
                await reload();
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: `Unable to update lesson status: ${error}`
                });
            }
        }
    };

    const handleNextLesson = () => {
        if (activeVideo && activeVideo.index < content.length - 1) {
            const nextVideoIndex = activeVideo.index + 1;
            const nextLesson = content[nextVideoIndex];
            const currentLesson = content[activeVideo.index];

            const currentSection = content.filter((item: any) => item.sectionOrder === activeVideo.sectionOrder);

            const nextLessonWithQuiz = currentSection.find((item: any, index: number) => {
                return index > activeVideo.index && item.quizzes?.length > 0;
            });

            if (currentSection.length === 2 && nextLessonWithQuiz?.quizzes?.length > 0) {
                setSelectedQuizId(currentSection[0].quizzes[0]._id);
                setQuizQuestions(currentSection[0].quizzes[0].questions);
            } else if (nextLesson?.quizzes?.length > 0) {
                setSelectedQuizId(currentSection[0].quizzes[0]._id);
                setQuizQuestions(currentSection[0].quizzes[0].questions);
            } else {
                setActiveVideo({ sectionOrder: currentSection[0].sectionOrder, index: nextVideoIndex });
                setVideoProgress(0);
                setSelectedQuizId(null);
                setQuizQuestions([]);
            }

            if (nextLesson.sectionOrder !== currentLesson.sectionOrder) {
                setActiveVideo({ sectionOrder: currentSection[0].sectionOrder + 1, index: 0 });
                setVideoProgress(0);
                setSelectedQuizId(null);
                setQuizQuestions([]);
            } else {
                setActiveVideo({ sectionOrder: currentSection[0].sectionOrder, index: nextVideoIndex });
                setVideoProgress(0);
            }
        }
    };

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
            {selectedQuizId ? (
                <Practice
                    questionArr={quizQuestions}
                    quizId={selectedQuizId}
                    courseId={typeof courseId === 'string' ? courseId : ''}
                    activeVideo={activeVideo}
                    course={course}
                    reload={reload}
                />
            ) : (
                <VideoPlayer videoUrl={content?.[activeVideo?.index]?.videoUrl?.url} onProgress={handleVideoProgress} />
            )}
            <div className="w-full flex items-center justify-between my-5">
                <Button
                    size={'rounded'}
                    className={activeVideo?.index === 0 ? '!cursor-no-drop opacity-80 hover:bg-primary-800' : ''}
                    onClick={() =>
                        setActiveVideo({ sectionOrder: activeVideo?.sectionOrder, index: activeVideo?.index - 1 })
                    }
                >
                    <HiArrowLeft />
                    Prev Lesson
                </Button>

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
            {content[activeVideo.index].questions.map((item: any, index: number) => (
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
                        {/* {format(new Date(item?.createdAt), 'hh:mm-MM/dd/yyyy')} */}
                        {item?.createdAt}
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
