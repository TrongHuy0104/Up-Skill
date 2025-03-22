'use client';

import { useState, Fragment, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { FaEllipsisV, FaChevronDown } from 'react-icons/fa';
import CoursePreview from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/CoursePreview';
import axios from 'axios';
import CourseContent from '@/components/custom/CourseContent';

interface Request {
    id: number;
    name: string;
    address: string;
    phone: string;
    action: 'pending' | 'reject' | 'accept';
    email: string;
    registeredAt: string;
    status: string;
}

const initialData: Request[] = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        address: 'Hà Nội',
        phone: '0123 456 789',
        action: 'pending',
        email: 'a@example.com',
        registeredAt: '2024-03-01',
        status: 'Chờ duyệt'
    },
    {
        id: 2,
        name: 'Trần Thị B',
        address: 'TP. Hồ Chí Minh',
        phone: '0987 654 321',
        action: 'pending',
        email: 'b@example.com',
        registeredAt: '2024-02-28',
        status: 'Đã duyệt'
    },
    {
        id: 3,
        name: 'Lê Văn C',
        address: 'Đà Nẵng',
        phone: '0345 678 901',
        action: 'pending',
        email: 'c@example.com',
        registeredAt: '2024-03-02',
        status: 'Chờ duyệt'
    }
];

export default function RequestList() {
    const [requests, setRequests] = useState(initialData);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [active, setActive] = useState(4);
    const [course, setCourse] = useState<any>();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/67d688d76fa0dac8d7d416a7`
                );
                setCourse(response.data.course);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);
    const handleActionChange = (id: number, newAction: 'accept' | 'reject') => {
        setRequests((prev) => prev.map((user) => (user.id === id ? { ...user, action: newAction } : user)));
    };

    const toggleRow = (id: number) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id); // Đóng hàng nếu đang mở
            } else {
                newSet.add(id); // Mở hàng nếu đang đóng
            }
            return newSet;
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">List of Courses Requests</h2>
            <div className="rounded-xl overflow-hidden border border-gray-300 bg-white">
                <Table className="bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((user) => (
                            <Fragment key={user.id}>
                                <TableRow className="hover:bg-gray-200 transition-all">
                                    <TableCell className="font-semibold text-black">{user.name}</TableCell>
                                    <TableCell className="text-gray-600">{user.address}</TableCell>
                                    <TableCell className="text-gray-600">{user.phone}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-white text-sm ${
                                                user.action === 'accept'
                                                    ? 'bg-green-500'
                                                    : user.action === 'reject'
                                                      ? 'bg-red-500'
                                                      : 'bg-yellow-500'
                                            }`}
                                        >
                                            {user.action === 'accept'
                                                ? 'Accepted'
                                                : user.action === 'reject'
                                                  ? 'Rejected'
                                                  : 'Pending'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="relative">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <FaEllipsisV />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleActionChange(user.id, 'reject')}>
                                                    Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleActionChange(user.id, 'accept')}>
                                                    Accept
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => toggleRow(user.id)}>
                                            <FaChevronDown
                                                className={`transition-transform ${
                                                    expandedRows.has(user.id) ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(user.id) && (
                                    <TableRow className="bg-gray-50">
                                        <TableCell colSpan={6}>
                                            <div className="p-4">
                                                <CoursePreview active={active} setActive={setActive} course={course} />
                                            </div>
                                            <CourseContent data={course?.courseData} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {requests.length === 0 && <p className="text-center text-gray-500 mt-4">Không có yêu cầu nào.</p>}
        </div>
    );
}
