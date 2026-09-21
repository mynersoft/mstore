'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import { store } from '@/redux/store/store';
import { queryClient } from '@/lib/queryClient';

export default function Providers({ children }) {
	return (
		<ReduxProvider store={store}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</ReduxProvider>
	);
}
