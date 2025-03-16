import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/Radio';
import axios from 'axios';

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

export default function Practice({ quizId }: { quizId: string }) {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(
            questions[currentQuestionIndex]?.type === 'single-choice' ? singleChoiceSchema : multipleChoiceSchema
        ),
        defaultValues: {
            answer: '', // Giá trị mặc định cho single-choice
            answers: [] // Giá trị mặc định cho multiple-choice
        }
    });

    // Fetch user info (userId) from API

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
                withCredentials: true
            });
            const userId = response.data.user._id;
            console.log('userId', userId);
            return userId;
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Update quiz score in the userScores
    const updateQuizScore = async (quizId: string, userId: string, newScore: number) => {
        const currentQuestion = questions[currentQuestionIndex];

        // Kiểm tra nếu userScores là mảng hợp lệ, nếu không thì gán giá trị mặc định là mảng rỗng
        const userScores = Array.isArray(currentQuestion.userScores) ? currentQuestion.userScores : [];

        const res = await fetch(`http://localhost:8000/api/quizzes/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userScores: [
                    ...userScores.map((scoreEntry: any) => {
                        if (scoreEntry.user === userId) {
                            if (scoreEntry.score < newScore) {
                                return { ...scoreEntry, score: newScore }; // Update if new score is higher
                            }
                        }
                        return scoreEntry;
                    }),
                    { user: userId, score: newScore } // Add if not found
                ]
            })
        });

        const data = await res.json();
        return data;
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/api/quizzes/${quizId}/questions`);
                if (!res.ok) throw new Error('Failed to fetch questions');
                const data = await res.json();
                setQuestions(data.questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [quizId]);

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
            setScore(score + currentQuestion.points);
        }

        if (currentQuestionIndex === questions.length - 1) {
            setIsQuizFinished(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            form.reset({ answer: '', answers: [] }); // Reset form về trạng thái ban đầu
        }

        // Update the user's score in userScores
        const userId = await getUserInfo(); // Get the logged-in user's ID
        await updateQuizScore(quizId, userId, score + currentQuestion.points); // Update quiz score
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizFinished(false);
        form.reset();
    };

    const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
    const percentage = (score / totalPoints) * 100;

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
