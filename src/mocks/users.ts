import type { UpdateUserInput, User } from "@/types/user";

let mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Nguyen",
    email: "alice@example.com",
    countryCode: "VN",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    countryCode: "US",
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    email: "yuki@example.com",
    countryCode: "JP",
  },
  {
    id: "4",
    name: "Min-jun Park",
    email: "minjun@example.com",
    countryCode: "KR",
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma@example.com",
    countryCode: "GB",
  },
];

export function getMockUsers(): User[] {
  return [...mockUsers];
}

export function updateMockUser(
  id: string,
  input: UpdateUserInput,
): User | null {
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index === -1) {
    return null;
  }

  mockUsers[index] = { id, ...input };
  return mockUsers[index];
}

export function deleteMockUser(id: string): boolean {
  const previousLength = mockUsers.length;
  mockUsers = mockUsers.filter((user) => user.id !== id);
  return mockUsers.length < previousLength;
}
