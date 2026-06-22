import { ApolloLink, Observable } from "@apollo/client"
import { MOCK_COUNTRIES } from "@/mocks/countries"
import {
  createMockUser,
  deleteMockUser,
  getMockUsers,
  updateMockUser,
} from "@/mocks/users"
import type { CreateUserInput, UpdateUserInput } from "@/types/user"

const FAKE_API_DELAY_MS = 800

export const mockLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    let cancelled = false

    const timer = setTimeout(() => {
      if (cancelled) {
        return
      }

      if (operation.operationName === "GetCountries") {
        observer.next({
          data: { countries: MOCK_COUNTRIES },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "GetUsers") {
        observer.next({
          data: { users: getMockUsers() },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "CreateUser") {
        const { input } = operation.variables as {
          input: CreateUserInput
        }
        const createdUser = createMockUser(input)

        observer.next({
          data: { createUser: createdUser },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "UpdateUser") {
        const { id, input } = operation.variables as {
          id: string
          input: UpdateUserInput
        }
        const updatedUser = updateMockUser(id, input)

        if (!updatedUser) {
          observer.error(new Error(`User not found: ${id}`))
          return
        }

        observer.next({
          data: { updateUser: updatedUser },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "DeleteUser") {
        const { id } = operation.variables as { id: string }
        const success = deleteMockUser(id)

        if (!success) {
          observer.error(new Error(`User not found: ${id}`))
          return
        }

        observer.next({
          data: { deleteUser: { id, success: true } },
        })
        observer.complete()
        return
      }

      observer.error(
        new Error(`Unmocked GraphQL operation: ${operation.operationName}`),
      )
    }, FAKE_API_DELAY_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  })
})
