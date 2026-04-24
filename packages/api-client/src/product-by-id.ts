import { useQuery } from '@tanstack/react-query'
import type {
  DataTag,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type { ProductModel } from './generated/index.schemas'
import { fetcher } from './fetcher'

type AwaitedInput<T> = PromiseLike<T> | T
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

export type productControllerProductByIdResponse200 = {
  data: ProductModel
  status: 200
}

export type productControllerProductByIdResponseSuccess =
  productControllerProductByIdResponse200 & { headers: Headers }

export type productControllerProductByIdResponse =
  productControllerProductByIdResponseSuccess

export const getProductControllerProductByIdUrl = (id: string) =>
  `/api/products/${id}`

export const productControllerProductById = async (
  id: string,
  options?: RequestInit,
): Promise<productControllerProductByIdResponse> =>
  fetcher<productControllerProductByIdResponse>(
    getProductControllerProductByIdUrl(id),
    { ...options, method: 'GET' },
  )

export const getProductControllerProductByIdQueryKey = (id: string) =>
  [`/api/products/${id}`] as const

export const getProductControllerProductByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof productControllerProductById>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof productControllerProductById>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof fetcher>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}
  const queryKey =
    queryOptions?.queryKey ?? getProductControllerProductByIdQueryKey(id)
  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof productControllerProductById>>
  > = ({ signal }) =>
    productControllerProductById(id, { signal, ...requestOptions })

  return {
    queryKey,
    queryFn,
    enabled: Boolean(id),
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof productControllerProductById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ProductControllerProductByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof productControllerProductById>>
>
export type ProductControllerProductByIdQueryError = unknown

export function useProductControllerProductById<
  TData = Awaited<ReturnType<typeof productControllerProductById>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof productControllerProductById>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof fetcher>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
} {
  const queryOptions = getProductControllerProductByIdQueryOptions(id, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}
