/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginUser
// ====================================================

export interface LoginUser_loginUser {
  __typename: "AuthTokens";
  accessToken: string;
}

export interface LoginUser {
  loginUser: LoginUser_loginUser | null;
}

export interface LoginUserVariables {
  email: string;
  password: string;
}
