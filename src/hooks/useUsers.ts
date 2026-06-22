import { useQuery } from "@apollo/client"
import { GET_USERS } from "@/graphql/queries/users"
import type { GetUsersData } from "@/types/user"

interface UseUsersResult {
  users: GetUsersData["users"]
  loading: boolean
  error: Error | undefined
  refetch: () => void
}

export function useUsers(): UseUsersResult {
  const { data, loading, error, refetch } = useQuery<GetUsersData>(GET_USERS)

  return {
    users: data?.users ?? [],
    loading,
    error: error ?? undefined,
    refetch: () => {
      void refetch()
    },
  }
}
