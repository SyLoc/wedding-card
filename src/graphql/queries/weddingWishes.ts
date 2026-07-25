import { gql } from "@apollo/client"

export const GET_WEDDING_WISHES = gql`
  query GetWeddingWishes {
    weddingWishes {
      id
      guestName
      message
      createdAt
    }
  }
`
