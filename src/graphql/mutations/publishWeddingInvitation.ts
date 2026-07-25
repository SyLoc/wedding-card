import { gql } from "@apollo/client"

export const PUBLISH_WEDDING_INVITATION = gql`
  mutation PublishWeddingInvitation($id: ID!) {
    publishWeddingInvitation(id: $id) {
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
