import { Alert, Button, Card, Form, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import type { Country } from "@/types/country";

interface ExampleFormValues {
  name: string;
  email: string;
  countryCode: string;
}

interface ExampleFormProps {
  countries: Country[];
  countriesLoading: boolean;
  countriesError: Error | undefined;
}

export function ExampleForm({
  countries,
  countriesLoading,
  countriesError,
}: ExampleFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExampleFormValues>({
    defaultValues: {
      name: "",
      email: "",
      countryCode: "",
    },
  });

  const onSubmit = (values: ExampleFormValues) => {
    const country = countries.find((item) => item.code === values.countryCode);
    const message = country
      ? `Hello ${values.name} from ${country.name}!`
      : `Hello ${values.name}!`;

    alert(message);
    reset();
  };

  return (
    <Card title="Contact form" className="shadow-sm">
      {countriesError && (
        <Alert
          type="warning"
          showIcon
          className="mb-4"
          message="Could not load countries"
          description={countriesError.message}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
              <Input {...field} placeholder="Your name" />
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
                allowClear
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

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Submit
        </Button>
      </Form>
    </Card>
  );
}
