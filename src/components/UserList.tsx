import { Alert, Button, Card, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";
import { UserEditModal } from "@/components/UserEditModal";
import { useUserMutations } from "@/hooks/useUserMutations";
import type { Country } from "@/types/country";
import type { UpdateUserInput, User } from "@/types/user";

interface UserListProps {
  users: User[];
  loading: boolean;
  error: Error | undefined;
  countries: Country[];
  countriesLoading: boolean;
}

export function UserList({
  users,
  loading,
  error,
  countries,
  countriesLoading,
}: UserListProps) {
  const { updateUser, deleteUser, updating } = useUserMutations();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const countryNameByCode = useMemo(
    () => new Map(countries.map((country) => [country.code, country.name])),
    [countries],
  );

  const handleEditSave = useCallback(
    async (id: string, input: UpdateUserInput) => {
      try {
        setMutationError(null);
        await updateUser(id, input);
        setEditingUser(null);
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : "Failed to update user",
        );
        throw err;
      }
    },
    [updateUser],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setMutationError(null);
        setDeletingUserId(id);
        await deleteUser(id);
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : "Failed to delete user",
        );
      } finally {
        setDeletingUserId(null);
      }
    },
    [deleteUser],
  );

  const columns: ColumnsType<User> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Country",
        dataIndex: "countryCode",
        key: "countryCode",
        render: (countryCode: string) => {
          const countryName = countryNameByCode.get(countryCode);
          return <Tag color="blue">{countryName ?? countryCode}</Tag>;
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 160,
        render: (_, user) => (
          <Space>
            <Button type="link" onClick={() => setEditingUser(user)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete user"
              description={`Remove ${user.name}?`}
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
              onConfirm={() => handleDelete(user.id)}
            >
              <Button type="link" danger loading={deletingUserId === user.id}>
                Remove
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [countryNameByCode, deletingUserId, handleDelete],
  );

  return (
    <>
      <Card title="User management" className="mb-6 shadow-sm">
        {error && (
          <Alert
            type="error"
            showIcon
            className="mb-4"
            message="Could not load users"
            description={error.message}
          />
        )}

        {mutationError && (
          <Alert
            type="error"
            showIcon
            className="mb-4"
            message="Action failed"
            description={mutationError}
            closable
            onClose={() => setMutationError(null)}
          />
        )}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          locale={{ emptyText: loading ? "Loading..." : "No users" }}
        />
      </Card>

      <UserEditModal
        open={editingUser !== null}
        user={editingUser}
        countries={countries}
        countriesLoading={countriesLoading}
        saving={updating}
        onCancel={() => setEditingUser(null)}
        onSave={handleEditSave}
      />
    </>
  );
}
