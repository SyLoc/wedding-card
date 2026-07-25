import { gql } from "@apollo/client"

export const CREATE_WEDDING_WISH = gql`
  mutation CreateWeddingWish($input: CreateWeddingWishInput!) {
    createWeddingWish(input: $input) {
      id
      guestName
      message
      createdAt
    }
  }
`
