import { Alert, Form, Modal } from "antd"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { UserFormFields } from "@/components/UserFormFields"
import { EMPTY_USER_FORM_VALUES } from "@/components/userFormValues"
import type { Country } from "@/types/country"
import type { CreateUserInput } from "@/types/user"
import { userInputSchema } from "@/validation/user"

interface UserCreateModalProps {
  open: boolean
  countries: Country[]
  countriesLoading: boolean
  saving: boolean
  error: string | null
  onCancel: () => void
  onSave: (input: CreateUserInput) => Promise<void>
}

export function UserCreateModal({
  open,
  countries,
  countriesLoading,
  saving,
  error,
  onCancel,
  onSave,
}: UserCreateModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(userInputSchema),
    defaultValues: EMPTY_USER_FORM_VALUES,
  })

  useEffect(() => {
    if (!open) {
      reset(EMPTY_USER_FORM_VALUES)
    }
  }, [open, reset])

  const handleValidSubmit: SubmitHandler<CreateUserInput> = (values) =>
    onSave(values)

  const handleOk = () => {
    void handleSubmit(handleValidSubmit)()
  }

  return (
    <Modal
      title="Create user"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      destroyOnClose
      okText="Create"
      okButtonProps={{ disabled: countriesLoading }}
    >
      <Form layout="vertical">
        {error && (
          <Alert
            type="error"
            showIcon
            className="mb-4"
            message="Could not create user"
            description={error}
          />
        )}

        <UserFormFields
          control={control}
          errors={errors}
          countries={countries}
          countriesLoading={countriesLoading}
        />
      </Form>
    </Modal>
  )
}
