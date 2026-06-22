export interface UserInput {
  name: string;
  email: string;
  countryCode: string;
}

export interface User extends UserInput {
  id: string;
}

export interface GetUsersData {
  users: User[];
}

export type CreateUserInput = UserInput;

export interface CreateUserVariables {
  input: CreateUserInput;
}

export interface CreateUserData {
  createUser: User;
}

export type UpdateUserInput = UserInput;

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
