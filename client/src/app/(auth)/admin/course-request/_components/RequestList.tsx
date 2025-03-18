'use client';

import { useState, Fragment } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

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
    status: 'Chờ duyệt',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    address: 'TP. Hồ Chí Minh',
    phone: '0987 654 321',
    action: 'pending',
    email: 'b@example.com',
    registeredAt: '2024-02-28',
    status: 'Đã duyệt',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    address: 'Đà Nẵng',
    phone: '0345 678 901',
    action: 'pending',
    email: 'c@example.com',
    registeredAt: '2024-03-02',
    status: 'Chờ duyệt',
  },
];

export default function RequestList() {
  const [requests, setRequests] = useState(initialData);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openDetails, setOpenDetails] = useState<number | null>(null);

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
              <th className="px-4 py-2 text-left">More</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((user) => (
              <Fragment key={user.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-all">
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
                  {/* Nút mở rộng component */}
                  <td className="px-4 py-4 relative flex items-center">
                    <button
                      className="p-2 rounded-md hover:bg-gray-200"
                      onClick={() => setOpenDetails(openDetails === user.id ? null : user.id)}
                    >
                      <FaEllipsisV />
                    </button>
                  </td>
                </tr>
                {/* Hiển thị component mở rộng bên dưới nếu được chọn */}
                {openDetails === user.id && (
                  <tr className="bg-gray-100">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="p-4 border rounded-lg bg-white shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Chi tiết giảng viên</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Ngày đăng ký:</strong> {user.registeredAt}</p>
                        <p><strong>Trạng thái:</strong> {user.status}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {requests.length === 0 && <p className="text-center text-gray-500 mt-4">Không có yêu cầu nào.</p>}
    </div>
  );
}
