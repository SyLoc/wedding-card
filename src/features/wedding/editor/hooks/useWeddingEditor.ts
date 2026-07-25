import { useMutation, useQuery } from "@apollo/client"
import { useCallback } from "react"
import { PUBLISH_WEDDING_INVITATION } from "@/graphql/mutations/publishWeddingInvitation"
import { UPDATE_WEDDING_INVITATION } from "@/graphql/mutations/updateWeddingInvitation"
import { GET_WEDDING_INVITATION } from "@/graphql/queries/weddingInvitation"
import type {
  GetWeddingInvitationData,
  GetWeddingInvitationVariables,
  PublishWeddingInvitationData,
  PublishWeddingInvitationVariables,
  UpdateWeddingInvitationData,
  UpdateWeddingInvitationVariables,
  WeddingInvitation,
} from "@/types/wedding"

export function useWeddingEditor(invitationId: string) {
  const { data, loading, error } = useQuery<
    GetWeddingInvitationData,
    GetWeddingInvitationVariables
  >(GET_WEDDING_INVITATION, {
    variables: { id: invitationId },
  })
  const [updateInvitation] = useMutation<
    UpdateWeddingInvitationData,
    UpdateWeddingInvitationVariables
  >(UPDATE_WEDDING_INVITATION)
  const [publishInvitationMutation] = useMutation<
    PublishWeddingInvitationData,
    PublishWeddingInvitationVariables
  >(PUBLISH_WEDDING_INVITATION)

  const saveInvitation = useCallback(
    async (input: WeddingInvitation) => {
      const result = await updateInvitation({
        variables: { id: invitationId, input },
      })

      if (!result.data) {
        throw new Error("Wedding invitation was not saved")
      }

      return result.data.updateWeddingInvitation
    },
    [invitationId, updateInvitation],
  )

  const publishInvitation = useCallback(async () => {
    const result = await publishInvitationMutation({
      variables: { id: invitationId },
    })

    if (!result.data) {
      throw new Error("Wedding invitation was not published")
    }

    return result.data.publishWeddingInvitation
  }, [invitationId, publishInvitationMutation])

  return {
    invitation: data?.weddingInvitation,
    loading,
    error,
    saveInvitation,
    publishInvitation,
  }
}
