import { Alert, Card, Table, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import type { Country } from "@/types/country"
import { useMemo } from "react"

interface CountryListProps {
  countries: Country[]
  loading: boolean
  error: Error | undefined
}

function countryCodeToFlag(code: string): string {
  return [...code.toUpperCase()]
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join("")
}

export function CountryList({ countries, loading, error }: CountryListProps) {
  const columns: ColumnsType<Country> = useMemo(
    () => [
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
      {
        title: "Flag",
        key: "flag",
        width: 80,
        align: "center",
        render: (_, record) => (
          <span className="text-2xl" role="img" aria-label={`${record.name} flag`}>
            {countryCodeToFlag(record.code)}
          </span>
        ),
      },
    ],
    [],
  )

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
  )
}
