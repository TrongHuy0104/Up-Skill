"use client";

import { useState } from 'react';
import { 
  useCreateCouponMutation, 
  useDeleteCouponMutation, 
  useGetAllCouponsQuery, 
  useUpdateCouponMutation 
} from '@/lib/redux/features/coupon/couponApi';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    expiryDate: string;
    usageLimit: number;
    isActive: boolean;
}

const CouponManagementPage = () => {
  const { data: coupons, isLoading, refetch } = useGetAllCouponsQuery(undefined);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  
  const [couponForm, setCouponForm] = useState<Omit<Coupon, '_id'>>({ 
    code: '', 
    discountPercentage: 0, 
    expiryDate: format(new Date(), 'yyyy-MM-dd'), 
    usageLimit: 1,
    isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCouponForm(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' || name === 'usageLimit' ? Number(value) : value
    }));
  };

  const handleCreateCoupon = async () => {
    try {
      await createCoupon(couponForm).unwrap();
      toast({
            variant: 'success',
            title: `Coupon created successfully!`,
        });
      setCouponForm({ 
        code: '', 
        discountPercentage: 0, 
        expiryDate: format(new Date(), 'yyyy-MM-dd'), 
        usageLimit: 1,
        isActive: true
      });
      refetch();
    } catch (error) {
      console.error('Create coupon error:', error);
    }
  };

  const handleUpdateCoupon = async () => {
    if (!editingId) return;
    
    try {
      await updateCoupon({ id: editingId, couponData: couponForm }).unwrap();
      toast({
        variant: 'success',
        title: `Coupon updated successfully!`,
    });
      setEditingId(null);
      setCouponForm({ 
        code: '', 
        discountPercentage: 0, 
        expiryDate: format(new Date(), 'yyyy-MM-dd'), 
        usageLimit: 1,
        isActive: true
      });
      refetch();
    } catch (error) {
      console.error('Update coupon error:', error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id).unwrap();
        toast({
            variant: 'success',
            title: `Coupon deleted successfully!`,
        });
        refetch();
      } catch (error) {
        console.error('Delete coupon error:', error);
      }
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingId(coupon._id);
    setCouponForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      expiryDate: format(new Date(coupon.expiryDate), 'yyyy-MM-dd'),
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCouponForm({ 
      code: '', 
      discountPercentage: 0, 
      expiryDate: format(new Date(), 'yyyy-MM-dd'), 
      usageLimit: 1,
      isActive: true
    });
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading coupons...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Coupon Management</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Update Coupon' : 'Create New Coupon'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                type="text"
                name="code"
                className="w-full p-2 border rounded"
                value={couponForm.code}
                onChange={handleInputChange}
                />
            </div>
            
            <div className="md:col-span-1 md:col-start-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                <input
                type="number"
                name="discountPercentage"
                className="w-full p-2 border rounded"
                min="1"
                max="100"
                value={couponForm.discountPercentage}
                onChange={handleInputChange}
                />
            </div>

            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                type="date"
                name="expiryDate"
                className="w-full p-2 border rounded"
                value={couponForm.expiryDate}
                onChange={handleInputChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                />
            </div>
            
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                type="number"
                name="usageLimit"
                className="w-full p-2 border rounded"
                min="1"
                value={couponForm.usageLimit}
                onChange={handleInputChange}
                />
            </div>
            
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                name="isActive"
                value={couponForm.isActive ? 'true' : 'false'}
                onChange={(e) => setCouponForm({...couponForm, isActive: e.target.value === 'true'})}
                className="w-full p-2 border rounded"
                >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
                </select>
            </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
                {editingId && (
                    <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                    >
                    Cancel
                    </button>
            )}
          <button
            onClick={editingId ? handleUpdateCoupon : handleCreateCoupon}
            disabled={isCreating || isUpdating || !couponForm.code}
            className={`px-4 py-2 rounded text-white ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} disabled:opacity-50`}
          >
            {isCreating || isUpdating ? 'Processing...' : editingId ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Coupon List</h2>
        {coupons?.coupons?.length === 0 ? (
          <p className="text-gray-500">No coupons available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-14 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                  <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-14 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons?.coupons?.map((coupon: Coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                    <td className="px-12 py-4 whitespace-nowrap">{coupon.discountPercentage}%</td>
                    <td className="px-10 py-4 whitespace-nowrap">{format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</td>
                    <td className="px-12 py-4 whitespace-nowrap">{coupon.usageLimit}</td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="text-yellow-600 py-1 px-4 rounded-lg bg-orange-100 hover:text-yellow-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        disabled={isDeleting}
                        className="text-red-600 py-1 px-2 rounded-lg bg-red-100 hover:text-red-900 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagementPage;