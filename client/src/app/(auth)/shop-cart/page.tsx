// ShopCart.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";
import Banner from "@/components/ui/Banner";
import axios from "axios";
import { redirect } from "next/navigation";
import { useCreatePaymentIntentMutation } from "@/lib/redux/features/order/orderApi";
import { useLoadUserQuery } from "@/lib/redux/features/api/apiSlice";
import { loadStripe } from "@stripe/stripe-js/pure";
import { orderCreatePaymentIntent } from "@/lib/redux/features/order/orderSlice";
import { useDispatch } from "react-redux";
import { removeCartItem } from '@/lib/redux/features/cart/cartSlice';

interface Course {
  _id: string;
  name: string;
  price?: number;
  thumbnail: {
    url: string;
  };
}

interface CartItem {
  _id: string;
  courseId: Course;
}

const ShopCart: React.FC = () => {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filteredCartItems, setFilteredCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [createPaymentIntent, { data: paymentIntentData, isLoading }] = useCreatePaymentIntentMutation();
  const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    setUser(userData?.user);
  }, [isLoadingUser, userData?.user]);

  const [stripePromise, setStripePromise] = useState<any>(null);

  const createPayment = async () => {
    if (!user) redirect('/');
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    setStripePromise(stripe);
    const amount = Math.round(discountedTotal * 100);
    try {
      const paymentIntentResult = await createPaymentIntent(amount).unwrap();
      dispatch(orderCreatePaymentIntent({ cartItems: filteredCartItems.map(item => item.courseId) })); // Sử dụng filteredCartItems
      redirect(`/checkout/${paymentIntentResult?.client_secret}`);
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
    }
  };


  useEffect(() => {
    if (paymentIntentData && stripePromise && !isLoading) {
      fetchCartItems();
      redirect(`/checkout/${paymentIntentData?.client_secret}`);
    }
  }, [paymentIntentData, stripePromise, isLoading]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/cart-items`, {
        withCredentials: true,
      });
      const items = response.data.cart.items || [];
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (userData?.user && cartItems) {
      const purchasedCourseIds = userData.user.purchasedCourses || [];
      const filteredItems = cartItems.filter(item => !purchasedCourseIds.includes(item.courseId._id));
      setFilteredCartItems(filteredItems);
    } else {
      setFilteredCartItems(cartItems); // Nếu userData chưa load, hiển thị toàn bộ cartItems
    }
  }, [cartItems, userData?.user]); // Corrected dependency array, using userData?.user instead of user

  const subtotal = filteredCartItems.reduce((acc, item) => acc + (item.courseId.price || 0), 0);
  const discountedTotal = isCouponApplied ? subtotal * 0.5 : subtotal;

  const handleApplyCoupon = () => {
    if (couponCode === "UPSKILL50") {
      setIsCouponApplied(true);
    } else {
      setIsCouponApplied(false);
      alert("Invalid coupon code.");
    }
  };

  const handleUpdateCart = () => {
    if (couponCode === "UPSKILL50") {
      setIsCouponApplied(true);
    } else {
      setIsCouponApplied(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/remove-item`, {
        data: { courseId: id },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(removeCartItem(id));
        setCartItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Banner Section */}
      <Banner
        title="Shop Cart"
        breadcrumbs={[
          { href: "/", text: "Home" },
          { href: "", text: "Page" },
          { text: "Shop" },
        ]}
        contentAlignment="center"
        backgroundColor="bg-accent-100"
        background="/images/shop-cart-banner.jpg"
      >
        <p className="text-primary-800 text-base">
          Products that help beginner designers become true unicorns.
        </p>
      </Banner>

      <div className="max-w-full mx-auto py-16 px-8">
        <div className="flex gap-8">
          {/* Cart Items */}
          <div className="w-[940px] ml-8 mr-5">
            <div className="">
              {filteredCartItems.length === 0 ? (
                <p className="text-center text-primary-800 font-medium">Your cart is empty</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-accent-100 text-primary-800">
                      <th className="py-6 px-6 text-base font-medium">Product</th>
                      <th className="py-6 px-6 text-base font-medium">Price</th>
                      <th className="py-6 px-6 text-base font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCartItems.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-4 px-4 flex items-center">
                          <Image
                            src={item.courseId.thumbnail.url}
                            alt={item.courseId.name}
                            width={50}
                            height={60}
                            className="object-cover mr-6"
                          />
                          <span className="text-base text-primary-800 font-medium">{item.courseId.name}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-primary-800">${item.courseId.price?.toFixed(2) || "N/A"}</td>
                        <td className="py-4 px-4 justify-items-center">
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-xl flex items-center justify-center w-8 h-8 rounded-full border border-primary-100 text-primary-800 transition duration-200"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Coupon Code */}
            <div className="bg-white py-4 mt-6 w-full">
              <div className="relative flex items-center gap-4">
                <div className="relative w-[520px] py-4 -ml-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder=" "
                    className="w-full ml-2 peer flex-grow border-b-2 border-primary-100 rounded-none pt-4 text-primary-800 text-base focus:outline-none focus:border-primary-800"
                  />
                  <label
                    htmlFor="couponCode"
                    className="w-full absolute left-2 top-0.5 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-primary-800 peer-focus:top-1 peer-focus:text-primary-800"
                  >
                    Coupon Code
                  </label>
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="w-[220px] bg-primary-800 text-primary-50 px-6 py-4 rounded-md hover:bg-accent-900 flex items-center justify-center gap-2 text-base font-medium"
                >
                  Apply Coupon <HiArrowUpRight />
                </button>
                <button
                  onClick={handleUpdateCart}
                  className="w-[200px] border border-primary-800 text-primary-800 px-6 py-4 rounded-md hover:bg-primary-800 hover:text-primary-50 flex items-center justify-center gap-2 text-base font-medium"
                >
                  Update Cart <HiArrowUpRight />
                </button>
              </div>
            </div>
          </div>

          {/* Cart Total */}
          <div className="w-[400px] -mr-10">
            <div className="bg-primary-50 p-6 border border-primary-100 h-[293px]">
              <h2 className="text-xl mb-6 font-medium">Cart Total</h2>
              <div className="border-b flex justify-between py-3 text-primary-800">
                <span>Sub Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-primary-800">
                <span>Total</span>
                <span>${discountedTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={createPayment}
                className="w-full bg-accent-900 text-primary-50 py-3 rounded mt-6 hover:bg-accent-900 flex justify-center items-center gap-2 text-base">
                Proceed to Checkout <HiArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;