'use client';

import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

interface Request {
  id: number;
  name: string;
  address: string;
  phone: string;
  action: 'pending' | 'reject' | 'accept';
}

const initialData: Request[] = [
  { id: 1, name: 'Nguyễn Văn A', address: 'Hà Nội', phone: '0123 456 789', action: 'pending' },
  { id: 2, name: 'Trần Thị B', address: 'TP. Hồ Chí Minh', phone: '0987 654 321', action: 'pending' },
  { id: 3, name: 'Lê Văn C', address: 'Đà Nẵng', phone: '0345 678 901', action: 'pending' },
];

export default function InstructorRequestList() {
  const [requests, setRequests] = useState(initialData);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleActionChange = (id: number, newAction: 'accept' | 'reject') => {
    setRequests((prev) =>
      prev.map((user) => (user.id === id ? { ...user, action: newAction } : user))
    );
    setOpenDropdown(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">List of Instructor Requests</h2>
      <div className="rounded-xl overflow-hidden border border-gray-300 shadow-md">
        <table className="w-full bg-white text-left">
          <thead className="border-b">
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
                <td className="px-4 py-4 relative flex items-center">
                  <span className={`px-2 py-1 rounded text-white text-sm ${user.action === 'accept' ? 'bg-green-500' : user.action === 'reject' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                    {user.action === 'accept' ? 'Accepted' : user.action === 'reject' ? 'Rejected' : 'Pending'}
                  </span>
                  <button
                    className="p-2 rounded-md hover:bg-gray-200 ml-2"
                    onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                  >
                    <FaEllipsisV />
                  </button>
                  {openDropdown === user.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-md rounded-md z-10">
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleActionChange(user.id, 'reject')}
                      >
                        Reject
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleActionChange(user.id, 'accept')}
                      >
                        Accept
                      </button>
                    </div>
                  )}
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
