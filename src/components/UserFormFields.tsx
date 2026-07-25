import { Form, Input, Select } from "antd"
import { useMemo } from "react"
import { Controller } from "react-hook-form"
import type { Control, FieldErrors } from "react-hook-form"
import type { Country } from "@/types/country"
import type { UserInput } from "@/types/user"

interface UserFormFieldsProps {
  control: Control<UserInput>
  errors: FieldErrors<UserInput>
  countries: Country[]
  countriesLoading: boolean
  currentCountryCode?: string
}

export function UserFormFields({
  control,
  errors,
  countries,
  countriesLoading,
  currentCountryCode,
}: UserFormFieldsProps) {
  const countryOptions = useMemo(() => {
    const options = countries.map((country) => ({
      value: country.code,
      label: country.name,
    }))

    if (
      currentCountryCode &&
      !options.some((option) => option.value === currentCountryCode)
    ) {
      options.unshift({
        value: currentCountryCode,
        label: currentCountryCode,
      })
    }

    return options
  }, [countries, currentCountryCode])

  return (
    <>
      <Form.Item
        label="Name"
        validateStatus={errors.name ? "error" : undefined}
        help={errors.name?.message}
        required
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Full name" />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : undefined}
        help={errors.email?.message}
        required
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} type="email" placeholder="you@example.com" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Country"
        validateStatus={errors.countryCode ? "error" : undefined}
        help={errors.countryCode?.message}
        required
      >
        <Controller
          name="countryCode"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              allowClear
              loading={countriesLoading}
              placeholder="Select a country"
              optionFilterProp="label"
              options={countryOptions}
            />
          )}
        />
      </Form.Item>
    </>
  )
}
