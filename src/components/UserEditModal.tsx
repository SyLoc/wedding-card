import { Alert, Form, Modal } from "antd"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { UserFormFields } from "@/components/UserFormFields"
import { EMPTY_USER_FORM_VALUES } from "@/components/userFormValues"
import type { Country } from "@/types/country"
import type { UpdateUserInput, User } from "@/types/user"

function getUserFormValues(user: User): UpdateUserInput {
  return {
    name: user.name,
    email: user.email,
    countryCode: user.countryCode,
  }
}

interface UserEditModalProps {
  open: boolean
  user: User | null
  countries: Country[]
  countriesLoading: boolean
  saving: boolean
  error: string | null
  onCancel: () => void
  onSave: (id: string, input: UpdateUserInput) => Promise<void>
}

export function UserEditModal({
  open,
  user,
  countries,
  countriesLoading,
  saving,
  error,
  onCancel,
  onSave,
}: UserEditModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: EMPTY_USER_FORM_VALUES,
  })

  useEffect(() => {
    if (open && user) {
      reset(getUserFormValues(user))
      return
    }

    if (!open) {
      reset(EMPTY_USER_FORM_VALUES)
    }
  }, [open, user, reset])

  const handleValidSubmit: SubmitHandler<UpdateUserInput> = (values) => {
    if (!user) return

    return onSave(user.id, values)
  }

  const handleOk = () => {
    void handleSubmit(handleValidSubmit)()
  }

  return (
    <Modal
      title="Edit user"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      destroyOnClose
      okText="Save"
      okButtonProps={{ disabled: countriesLoading }}
    >
      <Form layout="vertical">
        {error && (
          <Alert
            type="error"
            showIcon
            className="mb-4"
            message="Could not update user"
            description={error}
          />
        )}

        <UserFormFields
          control={control}
          errors={errors}
          countries={countries}
          countriesLoading={countriesLoading}
          currentCountryCode={user?.countryCode}
        />
      </Form>
    </Modal>
  )
}
