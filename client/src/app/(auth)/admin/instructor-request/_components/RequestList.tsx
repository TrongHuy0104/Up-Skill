'use client';


import { useState } from 'react';


interface Request {
  id: number;
  name: string;
  address: string;
  phone: string;
  action: 'reject' | 'accept';
}


const initialData: Request[] = [
  { id: 1, name: 'Nguyễn Văn A', address: 'Hà Nội', phone: '0123 456 789', action: 'reject' },
  { id: 2, name: 'Trần Thị B', address: 'TP. Hồ Chí Minh', phone: '0987 654 321', action: 'reject' },
  { id: 3, name: 'Lê Văn C', address: 'Đà Nẵng', phone: '0345 678 901', action: 'reject' },
];


export default function InstructorRequestList() {
  const [requests, setRequests] = useState(initialData);


  const handleActionChange = (id: number, newAction: 'accept' | 'reject') => {
    setRequests((prev) =>
      prev.map((user) => (user.id === id ? { ...user, action: newAction } : user))
    );
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">List of Instructor Requests</h2>
      <div className="rounded-xl overflow-hidden border border-gray-300 shadow-md">
        <table className="w-full bg-white text-left">
          <thead className=" border-b">
            <tr className="text-gray-700">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                <td className="px-4 py-4 font-semibold text-black">{user.name}</td>
                <td className="px-4 py-4 text-gray-600">{user.address}</td>
                <td className="px-4 py-4 text-gray-600">{user.phone}</td>
                <td className="px-4 py-4">
                  <select
                    className=""
                    value={user.action}
                    onChange={(e) => handleActionChange(user.id, e.target.value as 'accept' | 'reject')}
                  >
                    <option value="reject"> Reject</option>
                    <option value="accept"> Accept</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {requests.length === 0 && <p className="text-center text-gray-500 mt-4">Không có yêu cầu nào.</p>}
    </div>
  );
}
