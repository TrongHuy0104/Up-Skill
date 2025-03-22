'use client';

import { useState, Fragment, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { FaEllipsisV, FaChevronDown } from 'react-icons/fa';
import CoursePreview from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/CoursePreview';
import axios from 'axios';
import CourseContent from '@/components/custom/CourseContent';



export default function RequestList() {
    const [requests, setRequests] = useState<any>([]);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [active, setActive] = useState(4);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/request/get-request-pending`,  { withCredentials: true }
                );
                setRequests(response.data.data)
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

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
                        {requests.map((request :  any) => (
                            <Fragment key={request?.courseId?._id}>
                                <TableRow className="hover:bg-gray-200 transition-all">
                                    <TableCell className="font-semibold text-black">{request?.instructorId?.name}</TableCell>
                                    <TableCell className="text-gray-600">{request?.instructorId?.address}</TableCell>
                                    <TableCell className="text-gray-600">{request?.instructorId?.phone}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-white text-sm 
                                                    bg-yellow-500`}
                                        >
                                            Pending
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
                                                <DropdownMenuItem >
                                                    Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuItem >
                                                    Accept
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => toggleRow(request?.courseId?._id)}>
                                            <FaChevronDown
                                                className={`transition-transform ${
                                                    expandedRows.has(request?.courseId?._id) ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(request?.courseId?._id) && (
                                    <TableRow className="bg-gray-50">
                                        <TableCell colSpan={6}>
                                            <div className="p-4">
                                                <CoursePreview active={active} setActive={setActive} course={request?.courseId} />
                                            </div>
                                            <CourseContent data={request?.courseId?.courseData} />
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
