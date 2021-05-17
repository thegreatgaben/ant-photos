import { rule } from 'graphql-shield'

export const isAuthenticated = rule()((parent, args, { user }) => user !== null)
