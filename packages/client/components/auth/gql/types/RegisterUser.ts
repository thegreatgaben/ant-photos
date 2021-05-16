/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUser
// ====================================================

export interface RegisterUser_registerUser {
  __typename: "User";
  id: string;
}

export interface RegisterUser {
  registerUser: RegisterUser_registerUser | null;
}

export interface RegisterUserVariables {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
