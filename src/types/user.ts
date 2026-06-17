export interface User {
  id: string;
  name: string;
  email: string;
  countryCode: string;
}

export interface GetUsersData {
  users: User[];
}

export interface UpdateUserInput {
  name: string;
  email: string;
  countryCode: string;
}

export interface UpdateUserVariables {
  id: string;
  input: UpdateUserInput;
}

export interface UpdateUserData {
  updateUser: User;
}

export interface DeleteUserVariables {
  id: string;
}

export interface DeleteUserData {
  deleteUser: {
    id: string;
    success: boolean;
  };
}
