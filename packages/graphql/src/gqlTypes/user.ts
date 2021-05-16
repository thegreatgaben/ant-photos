import { gql } from 'apollo-server-express'

export const typeDef = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
    }

    input RegisterUserInput {
        name: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    extend type Mutation {
        registerUser(input: RegisterUserInput!): User
    }
`

export const resolvers = {
    Mutation: {
        registerUser: (_, input, { dataSources }) => {
            console.log('Registered!')
            return {
                id: '1234',
                name: 'Name',
                email: 'name@email.com'
            }
        }
    }
}
