import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/Radio';
import axios from 'axios';
import { useUpdateQuizCompletionMutation } from '@/lib/redux/features/progress/progressApi';

const singleChoiceSchema = z.object({
    answer: z.string().min(1, 'You need to select an option.')
});

const multipleChoiceSchema = z.object({
    answers: z.array(z.string()).nonempty('You need to select at least one option.')
});

type FormData = {
    answer?: string;
    answers?: string[];
};

export default function Practice({
    quizId,
    courseId,
    questionArr,
    activeVideo,
    course,
    reload
}: {
    quizId: string;
    courseId: string;
    questionArr: any[];
    activeVideo: { sectionOrder: number; index: number };
    readonly course: any;
    readonly reload: any;
}) {
    const content = course?.courseData;
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [updateQuizCompletion] = useUpdateQuizCompletionMutation();
    const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

    const form = useForm<FormData>({
        resolver: zodResolver(
            questions[currentQuestionIndex]?.type === 'single-choice' ? singleChoiceSchema : multipleChoiceSchema
        ),
        defaultValues: {
            answer: '',
            answers: []
        }
    });

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
                withCredentials: true
            });
            const userId = response.data.user._id;
            setUserId(userId);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const updateQuizScore = async (quizId: string, userId: string, newScore: number) => {
        const currentQuestion = questions[currentQuestionIndex];

        const userScores = Array.isArray(currentQuestion.userScores) ? currentQuestion.userScores : [];

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/quizzes/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userScores: [
                    ...userScores.map((scoreEntry: any) => {
                        if (scoreEntry.user === userId) {
                            if (scoreEntry.score < newScore) {
                                return { ...scoreEntry, score: newScore };
                            }
                        }
                        return scoreEntry;
                    }),
                    { user: userId, score: newScore }
                ]
            })
        });

        const data = await res.json();
        return data;
    };

    useEffect(() => {
        if (questionArr && questionArr.length > 0) {
            setQuestions(questionArr);
            setLoading(false);
        }
    }, [questionArr]);

    useEffect(() => {
        if (!userId) {
            getUserInfo();
        }
    }, [userId]);

    // useEffect(() => {
    //     if (isQuizFinished && userId) {
    //         const handleCompletion = async () => {
    //             const quizIdToAdd = content[activeVideo?.index]?.quizzes[0]?._id;
    //             if (!quizIdToAdd) return;

    //             await updateQuizCompletion({ quizId, courseId, isCompleted: true, userId });
    //             setCompletedQuizzes((prev) => [...prev, quizIdToAdd]);
    //         };
    //         handleCompletion();
    //     }
    // }, [isQuizFinished, score, userId]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswers = Array.isArray(currentQuestion.correctAnswer)
            ? currentQuestion.correctAnswer
            : [currentQuestion.correctAnswer];

        const selectedAnswers = currentQuestion.type === 'single-choice' ? [data.answer] : data.answers;

        const isCorrect =
            correctAnswers.every((ans: string) => selectedAnswers?.includes(ans)) &&
            selectedAnswers?.every((ans: string | undefined) => ans !== undefined && correctAnswers.includes(ans));

        if (isCorrect) {
            if (currentQuestion && currentQuestion.points) {
                setScore((prevScore) => prevScore + currentQuestion.points);
            }
        }

        if (currentQuestionIndex === questions.length - 1) {
            setIsQuizFinished(true);

            const totalPoints = questions.reduce((sum, question) => sum + (question.points || 0), 0);
            const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

            if (percentage >= 70 && userId) {
                try {
                    await updateQuizCompletion({ quizId, courseId, isCompleted: true, userId }).unwrap();
                    const newCompletedQuizzes = [...completedQuizzes, content[activeVideo?.index].quizzes[0]._id];
                    setCompletedQuizzes(newCompletedQuizzes);
                    await reload();
                } catch (error) {
                    console.error('Error updating quiz completion:', error);
                }
            }
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            form.reset({ answer: '', answers: [] });
        }

        if (userId) {
            await updateQuizScore(quizId, userId, score + (currentQuestion.points || 0));
        }
    };

    useEffect(() => {
        const updateQuiz = async () => {
            if (isQuizFinished) {
                const totalPoints = questions.reduce((sum, question) => sum + (question.points || 0), 0);
                const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

                if (percentage >= 70 && userId) {
                    try {
                        await updateQuizCompletion({ quizId, courseId, isCompleted: true, userId });
                        await reload();
                    } catch (error) {
                        console.error('Error updating quiz completion:', error);
                    }
                }
            }
        };

        updateQuiz();
    }, [isQuizFinished, score, questions, userId, quizId, courseId, reload, updateQuizCompletion]);

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizFinished(false);
        form.reset();
    };

    const totalPoints = questions.reduce((sum, question) => sum + (question.points || 0), 0);
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

    if (loading) {
        return <div>Loading questions...</div>;
    }

    if (!questions.length) {
        return <div>No questions available.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="bg-white p-6 ">
            {!isQuizFinished ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pr-9">
                        <h2 className="text-xl font-semibold mb-8  bg-accent-100 p-6 rounded-lg">
                            Question {currentQuestionIndex + 1}: {currentQuestion.text}
                        </h2>
                        {currentQuestion.type === 'single-choice' ? (
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem className="space-y-3 ">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                {currentQuestion.options.map((option: string) => (
                                                    <FormItem
                                                        key={option}
                                                        className="flex items-center space-x-3 space-y-0 pl-8 my-2"
                                                    >
                                                        <FormControl>
                                                            <RadioGroupItem value={option} className="opacity-50" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{option}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="answers"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        {currentQuestion.options.map((option: string) => (
                                            <FormItem
                                                key={option}
                                                className="flex items-center space-x-3 space-y-0 pl-8 my-2"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(option)}
                                                        onCheckedChange={(checked) => {
                                                            const updatedValue = field.value ?? [];
                                                            return checked
                                                                ? field.onChange([...updatedValue, option])
                                                                : field.onChange(
                                                                      updatedValue.filter(
                                                                          (value: string) => value !== option
                                                                      )
                                                                  );
                                                        }}
                                                        className="opacity-50"
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">{option}</FormLabel>
                                            </FormItem>
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={!form.formState.isValid}>
                                {isLastQuestion ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Result</h2>
                    <p className="text-lg mb-4">
                        You answered correctly {score}/{totalPoints} points ({percentage.toFixed(2)}%).
                    </p>
                    {percentage >= 70 ? (
                        <p className="text-green-600 font-semibold mb-4">Completely!</p>
                    ) : (
                        <p className="text-red-600 font-semibold mb-4">One more time!</p>
                    )}
                    <Button onClick={handleRestart}>Again</Button>
                </div>
            )}
        </div>
    );
}
