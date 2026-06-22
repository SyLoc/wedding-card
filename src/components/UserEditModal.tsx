import { Form, Input, Modal, Select } from "antd";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { Country } from "@/types/country";
import type { UpdateUserInput, User } from "@/types/user";

const EMPTY_FORM_VALUES: UpdateUserInput = {
  name: "",
  email: "",
  countryCode: "",
};

function getUserFormValues(user: User): UpdateUserInput {
  return {
    name: user.name,
    email: user.email,
    countryCode: user.countryCode,
  };
}

function validateName(value: string): true | string {
  return value.trim() ? true : "Name is required";
}

interface UserEditModalProps {
  open: boolean;
  user: User | null;
  countries: Country[];
  countriesLoading: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: (id: string, input: UpdateUserInput) => Promise<void>;
}

export function UserEditModal({
  open,
  user,
  countries,
  countriesLoading,
  saving,
  onCancel,
  onSave,
}: UserEditModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: EMPTY_FORM_VALUES,
  });

  useEffect(() => {
    if (open && user) {
      reset(getUserFormValues(user));
      return;
    }

    if (!open) {
      reset(EMPTY_FORM_VALUES);
    }
  }, [open, user, reset]);

  const countryOptions = useMemo(() => {
    const options = countries.map((country) => ({
      value: country.code,
      label: country.name,
    }));

    if (
      user?.countryCode &&
      !options.some((option) => option.value === user.countryCode)
    ) {
      options.unshift({
        value: user.countryCode,
        label: user.countryCode,
      });
    }

    return options;
  }, [countries, user?.countryCode]);

  const handleValidSubmit: SubmitHandler<UpdateUserInput> = (values) => {
    if (!user) return;

    return onSave(user.id, values);
  };

  const handleOk = () => {
    void handleSubmit(handleValidSubmit)();
  };

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
        <Form.Item
          label="Name"
          validateStatus={errors.name ? "error" : undefined}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              validate: validateName,
            }}
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
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
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
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                loading={countriesLoading}
                placeholder="Select a country"
                optionFilterProp="label"
                options={countryOptions}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
