"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from "@/components/ui/Table";
import Link from "next/link";
import Image from "next/image";
import PaginationComponent from "@/components/custom/PaginationComponent";
import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  _id: string;
  name: string;
  price?: number;
}

interface Order {
  _id: string;
  courseIds: Course[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalOrders / 10));

  // Fetch orders
  const fetchOrders = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/orders/user-orders`, {
      withCredentials: true,
    });

    console.log("Fetched orders:", response.data.orders);

    setOrders(response.data.orders);
    setTotalOrders(response.data.orders.length);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="ml-10 p-6 bg-primary-50 rounded-lg border border-primary-100">
      <h6 className="text-[22px] font-medium text-primary-800 m-4 mb-10 pb-3 border-b">Order History</h6>

      <Table className="rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-accent-100 text-[15px]">
            <TableHead className="py-[26px] pl-[30px] text-primary-800 font-medium rounded-l-xl">Order ID</TableHead>
            <TableHead className="py-[26px] text-primary-800 font-medium">Course Name</TableHead>
            <TableHead className="py-[26px] text-primary-800 font-medium">Date</TableHead>
            <TableHead className="py-[26px] text-primary-800 font-medium">Price</TableHead>
            <TableHead className="py-[26px] text-center text-primary-800 font-medium rounded-r-xl">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
        {orders.flatMap((order) => 
            order.courseIds.map((course, index) => (
              <TableRow key={`${order._id}-${course._id}-${index}`} className="border-b hover:bg-gray-50">
              <TableCell className="pl-[30px] text-[15px] text-primary-800 font-medium">{order._id}</TableCell>
              <TableCell className="text-[15px] text-primary-800 font-medium">
                <Link 
                  href={`/courses/${course._id}`} 
                  className="truncate hover:text-accent-900 transition-colors duration-200"
                >
                  {course.name}
                </Link>
              </TableCell>
              <TableCell className="text-[15px] text-primary-800 font-medium">
              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </TableCell>
              <TableCell className="text-[15px] text-primary-800 font-medium">
                ${course.price?.toFixed(2) || "N/A"}
              </TableCell>
              <TableCell className="flex justify-center space-x-3">
                <Link href={`/orders/${order._id}`}>
                  <button className="p-2 rounded-xl group border border-primary-100 bg-accent-100 hover:bg-primary-800 transition-colors duration-200">
                    <div className="relative w-4 h-4">
                      <Image 
                        src="/assets/icons/eye-icon.svg" 
                        alt="View" 
                        fill
                        className="group-hover:brightness-0 group-hover:invert transition-all duration-200"
                      />
                    </div>
                  </button>
                </Link>

                  <button 
                    // onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 rounded-xl group border border-primary-100 hover:bg-accent-900 transition-colors duration-200"
                  >
                    <div className="relative w-4 h-4">
                      <Image 
                        src="/assets/icons/delete.svg"
                        alt="Delete" 
                        fill
                        className="group-hover:brightness-0 group-hover:invert transition-all duration-200"
                      />
                    </div>
                  </button>

              </TableCell>
            </TableRow>
          ))
        )}
          </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="py-5 text-center">
              <PaginationComponent 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
