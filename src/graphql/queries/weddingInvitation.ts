import { gql } from "@apollo/client"

export const GET_WEDDING_INVITATION = gql`
  query GetWeddingInvitation($id: ID!) {
    weddingInvitation(id: $id) {
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
