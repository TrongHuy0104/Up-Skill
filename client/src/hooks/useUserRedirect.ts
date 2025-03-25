import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

const useUserRedirect = () => {
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);

    useEffect(() => {
        // Redirect logic
        if (!isLoadingUser && !userData) {
            console.log(userData);
            // If userData is not available and loading is complete, redirect to home page
            redirect('/');
        }
    }, [userData, isLoadingUser]);

    return { userData, isLoadingUser };
};

export default useUserRedirect;
