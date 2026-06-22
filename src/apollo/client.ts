import { ApolloClient, InMemoryCache } from "@apollo/client"
import { mockLink } from "@/apollo/mockLink"

export const apolloClient = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
})
