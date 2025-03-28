'use client';

import { useState, Fragment, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { FaChevronDown } from 'react-icons/fa';
import CoursePreview from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/CoursePreview';
import axios from 'axios';
import CourseContent from '@/components/custom/CourseContent';
import { toast } from '@/hooks/use-toast';


export default function RequestList() {
    const [requests, setRequests] = useState<any>([]);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [active, setActive] = useState(4);
    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/request/get-request-pending`,  { withCredentials: true }
            );
            setRequests(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };
    useEffect(() => {
        fetchRequests();
    }, []);
    const handleRequest = async (requestId: string, action: 'approve' | 'reject') => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/request/handle-request/${requestId}`,
                { action }, 
                { withCredentials: true }
            );
        setRequests((prevRequests :  any) => 
            prevRequests.filter((req : any) => req._id !== requestId)
        );

        await fetchRequests();
             toast({
                variant: 'success',
                title: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`
            });
        } catch (error) {
            console.error(`Error handling request ${action}:`, error);
        }
    };
    

    const toggleRow = (id: number) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
<div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">List of Courses Requests</h1>
            
            <div className="bg-white rounded-lg shadow p-6">
                {requests.length === 0 ? (
                    <p className="text-gray-500">No requests found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-14 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-16 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request: any) => (
                                    <Fragment key={request?.courseId?._id}>
                                        <tr className="transition-all">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{request?.instructorId?.name}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-gray-600">{request?.instructorId?.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{request?.instructorId?.phone}</td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="px-2 py-2 rounded-lg text-white text-sm bg-yellow-500">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => handleRequest(request?._id, 'approve')}
                                                    className="text-green-600 py-2 px-2 rounded-lg bg-green-100 hover:text-green-900"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRequest(request?._id, 'reject')}
                                                    className="text-red-600 py-2 px-4 rounded-lg bg-red-100 hover:text-red-900"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                            <td className="px-10 py-4 whitespace-nowrap">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => toggleRow(request?.courseId?._id)}
                                                    className="hover:bg-gray-100"
                                                >
                                                    <FaChevronDown
                                                        className={`transition-transform ${
                                                            expandedRows.has(request?.courseId?._id) ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                        {expandedRows.has(request?.courseId?._id) && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={6}>
                                                    <div className="p-4">
                                                        <CoursePreview active={active} setActive={setActive} course={request?.courseId} />
                                                    </div>
                                                    <CourseContent data={request?.courseId?.courseData} />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
