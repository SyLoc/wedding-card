import { gql } from "@apollo/client"

export const UPDATE_WEDDING_INVITATION = gql`
  mutation UpdateWeddingInvitation(
    $id: ID!
    $input: WeddingInvitationInput!
  ) {
    updateWeddingInvitation(id: $id, input: $input) {
      id
      slug
      templateId
      status
      couple
      families
      events
      gallery
      giftAccounts
      guest
      music
      heroImage
      eyebrow
      invitationTitle
      quote
      story
      closingMessage
    }
  }
`
