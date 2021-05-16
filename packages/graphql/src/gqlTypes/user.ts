import { gql } from 'apollo-server-express'
import bcrypt from 'bcrypt'

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
        async registerUser(_, { input }, { dataSources }) {
            // TODO: User input validation
            if (input.password !== input.confirmPassword) {
                throw new Error('Password and Confirm Password do not match.')
            }

            const existingUser = await dataSources.user.getOne('email', input.email)
            if (existingUser) {
                throw new Error('User with the provided email already exists.')
            }

            const saltRounds = Number(process.env.HASH_SALT_ROUNDS) || 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPassword = await bcrypt.hash(input.password, salt)
            const attributes = {
                name: input.name,
                email: input.email,
                password: hashedPassword
            }
            const user = await dataSources.user.create(attributes)
            return user
        }
    }
}
