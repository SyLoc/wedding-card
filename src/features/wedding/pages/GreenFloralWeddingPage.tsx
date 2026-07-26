import { useQuery } from "@apollo/client"
import { useParams, useSearchParams } from "react-router-dom"
import { GreenFloralTemplate } from "@/features/wedding/templates/green-floral/GreenFloralTemplate"
import { GET_WEDDING_INVITATION } from "@/graphql/queries/weddingInvitation"
import { GREEN_FLORAL_INVITATION } from "@/mocks/weddingInvitation"
import type {
  GetWeddingInvitationData,
  GetWeddingInvitationVariables,
} from "@/types/wedding"

export function GreenFloralWeddingPage() {
  const { slug: slugParam } = useParams<{ slug: string }>()
  const slug = slugParam ?? "demo"
  const [searchParams] = useSearchParams()
  const { data, loading } = useQuery<
    GetWeddingInvitationData,
    GetWeddingInvitationVariables
  >(GET_WEDDING_INVITATION, {
    variables: { id: slug },
    skip: slug === "demo",
  })

  if (slug !== "demo" && loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fffaf4] text-[#4c6755]">
        Đang mở thiệp cưới…
      </div>
    )
  }

  const baseInvitation = data?.weddingInvitation ?? GREEN_FLORAL_INVITATION
  const salutationFromUrl = searchParams.get("salutation")?.trim()
  const personalizedInvitation = {
    ...baseInvitation,
    guest: {
      name: searchParams.get("guest") ?? baseInvitation.guest.name,
      group: searchParams.get("group") ?? baseInvitation.guest.group,
      salutation: salutationFromUrl || baseInvitation.guest.salutation || "bạn",
      couplePronoun:
        searchParams.get("couplePronoun") ??
        baseInvitation.guest.couplePronoun,
    },
  }

  return (
    <GreenFloralTemplate
      invitation={personalizedInvitation}
      mode="public"
    />
  )
}
