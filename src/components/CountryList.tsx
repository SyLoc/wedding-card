import { Alert, Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Country } from "@/types/country";

interface CountryListProps {
  countries: Country[];
  loading: boolean;
  error: Error | undefined;
}

export function CountryList({ countries, loading, error }: CountryListProps) {
  const columns: ColumnsType<Country> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Country",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Card title="Countries from GraphQL mock" className="mb-6 shadow-sm">
      {error && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message="Could not load countries"
          description={error.message}
        />
      )}

      <Table
        rowKey="code"
        columns={columns}
        dataSource={countries}
        loading={loading}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        locale={{ emptyText: loading ? "Loading..." : "No data" }}
      />
    </Card>
  );
}
