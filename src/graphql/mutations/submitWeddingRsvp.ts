import { gql } from "@apollo/client"

export const SUBMIT_WEDDING_RSVP = gql`
  mutation SubmitWeddingRsvp($input: WeddingRsvpInput!) {
    submitWeddingRsvp(input: $input) {
      id
      guestName
      attendance
      guestCount
      message
      createdAt
    }
  }
`
