'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

interface ProviderProps {
    children: any;
}

export function Providers({ children }: ProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}
