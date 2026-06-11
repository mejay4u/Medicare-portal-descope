import { QueryClient, QueryCache } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetworkError, AuthError } from '../types/errors';
import { useUiStore } from '../store/ui.store';
import { setHttpClient } from '@medicare/shared';
import { httpClient } from '../services/http';

// Wire the shared service layer to use the Axios client (with auth interceptors)
setHttpClient(httpClient);

const APP_VERSION = '1.0.0';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof AuthError) return false;
        if (error instanceof NetworkError) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    },
    mutations: { retry: 0 },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof NetworkError) {
        useUiStore.getState().setOfflineBanner(true);
      }
    },
  }),
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'MEDICARE_QUERY_CACHE',
  throttleTime: 1_000,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000,
  buster: APP_VERSION,
});
