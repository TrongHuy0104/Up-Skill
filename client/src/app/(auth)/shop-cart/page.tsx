"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ShopCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Meaningful Future", price: 100.99, quantity: 12, image: "/images/product1.png" },
    { id: 2, name: "Meaningful Future", price: 100.99, quantity: 12, image: "/images/product1.png" },
    { id: 3, name: "Meaningful Future", price: 100.99, quantity: 12, image: "/images/product1.png" },
    { id: 4, name: "Meaningful Future", price: 100.99, quantity: 5, image: "/images/product1.png" },
  ]);

  const handleQuantityChange = (id: number, increment: boolean) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateCart = () => {
    alert("Cart updated successfully!");
  };

  return (
    <div className="max-w-[1340px] mx-auto py-16 px-8">
      <h1 className="text-2xl font-bold mb-8">Shop Cart</h1>
      <div className="flex gap-8">
        {/* Cart Items */}
        <div className="w-[940px]">
          <div className="bg-pink-50 p-6 rounded-lg shadow-sm border border-gray-200 h-[476px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-100 text-gray-700">
                  <th className="py-4 px-4 text-sm font-semibold">Product</th>
                  <th className="py-4 px-4 text-sm font-semibold">Price</th>
                  <th className="py-4 px-4 text-sm font-semibold">Quantity</th>
                  <th className="py-4 px-4 text-sm font-semibold">Subtotal</th>
                  <th className="py-4 px-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-none">
                    <td className="py-4 px-4 flex items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover mr-4"
                      />
                      <span className="text-sm text-orange-600">{item.name}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, false)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="mx-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, true)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm hover:bg-gray-100"
                      >
                        +
                      </button>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Coupon Code Row */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6 w-full">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                className="border border-gray-300 rounded px-4 py-2 flex-grow"
              />
              <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 flex items-center gap-2">
                Apply Coupon <HiArrowUpRight />
              </button>
              <button
                onClick={handleUpdateCart}
                className="border border-gray-700 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
              >
                Update Cart <HiArrowUpRight />
              </button>
            </div>
          </div>
        </div>

        {/* Cart Total */}
        <div className="w-[400px]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 h-[293px]">
            <h2 className="text-xl font-bold mb-6">Cart Total</h2>
            <div className="flex justify-between py-3 text-gray-700">
              <span>Sub Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-gray-700">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-orange-500 text-white py-3 rounded mt-6 hover:bg-orange-600 flex justify-center items-center gap-2 text-sm font-medium">
              Proceed to Checkout <HiArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
