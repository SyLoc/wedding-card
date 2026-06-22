import { useMutation } from "@apollo/client"
import { useCallback } from "react"
import { CREATE_USER } from "@/graphql/mutations/createUser"
import { DELETE_USER } from "@/graphql/mutations/deleteUser"
import { UPDATE_USER } from "@/graphql/mutations/updateUser"
import { GET_USERS } from "@/graphql/queries/users"
import type {
  CreateUserData,
  CreateUserInput,
  CreateUserVariables,
  DeleteUserData,
  DeleteUserVariables,
  UpdateUserData,
  UpdateUserInput,
  UpdateUserVariables,
} from "@/types/user"

interface UseUserMutationsResult {
  createUser: (input: CreateUserInput) => Promise<void>
  updateUser: (id: string, input: UpdateUserInput) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  creating: boolean
  updating: boolean
  deleting: boolean
}

export function useUserMutations(): UseUserMutationsResult {
  const [createUserMutation, { loading: creating }] = useMutation<
    CreateUserData,
    CreateUserVariables
  >(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  })

  const [updateUserMutation, { loading: updating }] = useMutation<
    UpdateUserData,
    UpdateUserVariables
  >(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  })

  const [deleteUserMutation, { loading: deleting }] = useMutation<
    DeleteUserData,
    DeleteUserVariables
  >(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  })

  const createUser = useCallback(
    async (input: CreateUserInput) => {
      await createUserMutation({ variables: { input } })
    },
    [createUserMutation],
  )

  const updateUser = useCallback(
    async (id: string, input: UpdateUserInput) => {
      await updateUserMutation({ variables: { id, input } })
    },
    [updateUserMutation],
  )

  const deleteUser = useCallback(
    async (id: string) => {
      await deleteUserMutation({ variables: { id } })
    },
    [deleteUserMutation],
  )

  return {
    createUser,
    updateUser,
    deleteUser,
    creating,
    updating,
    deleting,
  }
}
