'use client'

import { useCategoriesControllerFindAll } from '@repo/api-client'

export const useGetCategories = () => {
  const { data, isLoading } = useCategoriesControllerFindAll()

  return {
    categories: data?.data ?? [],
    isLoading,
  }
}
