import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { DELETE_USER } from "@/graphql/mutations/deleteUser";
import { UPDATE_USER } from "@/graphql/mutations/updateUser";
import { GET_USERS } from "@/graphql/queries/users";
import type {
  DeleteUserData,
  DeleteUserVariables,
  UpdateUserData,
  UpdateUserInput,
  UpdateUserVariables,
} from "@/types/user";

interface UseUserMutationsResult {
  updateUser: (id: string, input: UpdateUserInput) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updating: boolean;
  deleting: boolean;
}

export function useUserMutations(): UseUserMutationsResult {
  const [updateUserMutation, { loading: updating }] = useMutation<
    UpdateUserData,
    UpdateUserVariables
  >(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [deleteUserMutation, { loading: deleting }] = useMutation<
    DeleteUserData,
    DeleteUserVariables
  >(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const updateUser = useCallback(
    async (id: string, input: UpdateUserInput) => {
      await updateUserMutation({ variables: { id, input } });
    },
    [updateUserMutation],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      await deleteUserMutation({ variables: { id } });
    },
    [deleteUserMutation],
  );

  return {
    updateUser,
    deleteUser,
    updating,
    deleting,
  };
}
