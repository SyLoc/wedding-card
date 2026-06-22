import { useQuery } from "@apollo/client"
import { GET_COUNTRIES } from "@/graphql/queries/countries"
import type { GetCountriesData } from "@/types/country"

interface UseCountriesResult {
  countries: GetCountriesData["countries"]
  loading: boolean
  error: Error | undefined
}

export function useCountries(): UseCountriesResult {
  const { data, loading, error } = useQuery<GetCountriesData>(GET_COUNTRIES)

  return {
    countries: data?.countries ?? [],
    loading,
    error: error ?? undefined,
  }
}
