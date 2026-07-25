import { ApolloLink, Observable } from "@apollo/client"
import { MOCK_COUNTRIES } from "@/mocks/countries"
import {
  createMockWeddingRsvp,
  createMockWeddingWish,
  getMockWeddingWishes,
} from "@/mocks/wedding"
import {
  getMockWeddingInvitation,
  publishMockWeddingInvitation,
  updateMockWeddingInvitation,
} from "@/mocks/weddingEditor"
import {
  createMockUser,
  deleteMockUser,
  getMockUsers,
  updateMockUser,
} from "@/mocks/users"
import type { CreateUserInput, UpdateUserInput } from "@/types/user"
import type {
  CreateWeddingWishInput,
  WeddingRsvpInput,
} from "@/types/wedding"

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

      if (operation.operationName === "GetWeddingWishes") {
        observer.next({
          data: { weddingWishes: getMockWeddingWishes() },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "SubmitWeddingRsvp") {
        const { input } = operation.variables as {
          input: WeddingRsvpInput
        }

        observer.next({
          data: { submitWeddingRsvp: createMockWeddingRsvp(input) },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "CreateWeddingWish") {
        const { input } = operation.variables as {
          input: CreateWeddingWishInput
        }

        observer.next({
          data: { createWeddingWish: createMockWeddingWish(input) },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "GetWeddingInvitation") {
        const { id } = operation.variables as { id: string }

        observer.next({
          data: { weddingInvitation: getMockWeddingInvitation(id) },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "UpdateWeddingInvitation") {
        const { id, input } = operation.variables as {
          id: string
          input: import("@/types/wedding").WeddingInvitation
        }

        observer.next({
          data: {
            updateWeddingInvitation: updateMockWeddingInvitation(id, input),
          },
        })
        observer.complete()
        return
      }

      if (operation.operationName === "PublishWeddingInvitation") {
        const { id } = operation.variables as { id: string }

        observer.next({
          data: { publishWeddingInvitation: publishMockWeddingInvitation(id) },
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
