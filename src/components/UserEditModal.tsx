import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Country } from "@/types/country";
import type { UpdateUserInput, User } from "@/types/user";

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
    defaultValues: {
      name: "",
      email: "",
      countryCode: "",
    },
  });

  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name,
        email: user.email,
        countryCode: user.countryCode,
      });
    }
  }, [open, user, reset]);

  const handleOk = () =>
    new Promise<void>((resolve, reject) => {
      void handleSubmit(
        async (values) => {
          if (!user) {
            reject(new Error("No user selected"));
            return;
          }

          try {
            await onSave(user.id, values);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        () => {
          reject(new Error("Validation failed"));
        },
      )();
    });

  return (
    <Modal
      title="Edit user"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      destroyOnClose
      okText="Save"
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
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Full name" />
            )}
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
                options={countries.map((country) => ({
                  value: country.code,
                  label: country.name,
                }))}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
