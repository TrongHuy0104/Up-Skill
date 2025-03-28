'use client';

import { Button } from '@/components/ui/Button';
import { HiOutlineTrash, HiOutlinePencilAlt } from 'react-icons/hi';
import { useGetAllCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '@/lib/redux/features/coupon/couponApi';
import { useState } from 'react';

interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    expiryDate: string;
    usageLimit: number;
    usersUsed: string[];
}

const CouponPage = () => {
    const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 0, expiryDate: '', usageLimit: 0 });
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Get all coupons using couponApi
    const { data: coupons, error, isLoading } = useGetAllCouponsQuery(undefined);
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const handleCreateCoupon = async () => {
        try {
            await createCoupon(newCoupon).unwrap();
            setNewCoupon({ code: '', discountPercentage: 0, expiryDate: '', usageLimit: 0 });
            alert('Coupon created successfully');
        } catch (error) {
            console.error('Error creating coupon:', error);
        }
    };

    const handleUpdateCoupon = async (couponId: string) => {
        if (!editingCoupon) return;
        try {
            await updateCoupon({ id: couponId, couponData: editingCoupon }).unwrap();
            setEditingCoupon(null);
            alert('Coupon updated successfully');
        } catch (error) {
            console.error('Error updating coupon:', error);
        }
    };

    const handleDeleteCoupon = async (couponId: string) => {
        try {
            await deleteCoupon(couponId).unwrap();
            alert('Coupon deleted successfully');
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    const handleEditCoupon = (coupon: Coupon) => {
        setEditingCoupon(coupon);
    };

    const handleCancelEdit = () => {
        setEditingCoupon(null);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading coupons</div>;

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-5">Manage Coupon Codes</h1>
            
            {/* Create Coupon Form */}
            <div className="mb-5">
                <h2 className="text-xl font-semibold mb-2">Create New Coupon</h2>
                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="border p-2 mb-2"
                />
                <input
                    type="number"
                    placeholder="Discount Percentage"
                    value={newCoupon.discountPercentage}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: +e.target.value })}
                    className="border p-2 mb-2"
                />
                <input
                    type="date"
                    placeholder="Expiry Date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="border p-2 mb-2"
                />
                <input
                    type="number"
                    placeholder="Usage Limit"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: +e.target.value })}
                    className="border p-2 mb-2"
                />
                <Button onClick={handleCreateCoupon} disabled={isCreating}>Create Coupon</Button>
            </div>

            {/* Coupon List */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Existing Coupons</h2>
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Code</th>
                            <th className="border px-4 py-2">Discount %</th>
                            <th className="border px-4 py-2">Expiry Date</th>
                            <th className="border px-4 py-2">Usage Limit</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(coupons) && coupons.length > 0 ? (
                            coupons.map((coupon: Coupon) => (
                                <tr key={coupon._id}>
                                    <td className="border px-4 py-2">{coupon.code}</td>
                                    <td className="border px-4 py-2">{coupon.discountPercentage}</td>
                                    <td className="border px-4 py-2">{coupon.expiryDate}</td>
                                    <td className="border px-4 py-2">{coupon.usageLimit}</td>
                                    <td className="border px-4 py-2 flex gap-3">
                                        <Button onClick={() => handleEditCoupon(coupon)}>
                                            <HiOutlinePencilAlt />
                                        </Button>
                                        <Button onClick={() => handleDeleteCoupon(coupon._id)} className="text-red-600">
                                            <HiOutlineTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">No coupons found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Coupon Form */}
            {editingCoupon && (
                <div className="mt-5">
                    <h2 className="text-xl font-semibold mb-2">Edit Coupon</h2>
                    <input
                        type="text"
                        value={editingCoupon.code}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <input
                        type="number"
                        value={editingCoupon.discountPercentage}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, discountPercentage: +e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <input
                        type="date"
                        value={editingCoupon.expiryDate}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <input
                        type="number"
                        value={editingCoupon.usageLimit}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: +e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <Button onClick={() => handleUpdateCoupon(editingCoupon._id)} disabled={isUpdating}>Save Changes</Button>
                    <Button onClick={handleCancelEdit} className="ml-3">Cancel</Button>
                </div>
            )}
        </div>
    );
};

export default CouponPage;
