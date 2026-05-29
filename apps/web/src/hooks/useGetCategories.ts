import {
  getCategoriesControllerFindAllQueryKey,
  useCategoriesControllerFindAll,
} from '@repo/api-client'

export { getCategoriesControllerFindAllQueryKey }

export const useGetCategories = () => {
  const { data, isLoading } = useCategoriesControllerFindAll()

  return {
    categories: data?.data ?? [],
    isLoading,
    queryKey: getCategoriesControllerFindAllQueryKey(),
  }
}
