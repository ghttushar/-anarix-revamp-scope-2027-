import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';

interface UseAppQueryProps<TData, TError> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  options?: Partial<UseQueryOptions<TData, TError>>;
}

/** anarix-ui's query hook. There it also scoped the key to the signed-in accounts; this app has none. */
export function useAppQuery<TData = unknown, TError = unknown>({ queryKey, queryFn, enabled = true, options = {} }: UseAppQueryProps<TData, TError>) {
  return useQuery<TData, TError>({ queryKey, queryFn, enabled, ...options });
}
