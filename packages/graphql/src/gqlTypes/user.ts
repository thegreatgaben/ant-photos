import { gql } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

    input LoginUserInput {
        email: String!
        password: String!
    }

    type AuthTokens {
        accessToken: String!
    }

    extend type Mutation {
        registerUser(input: RegisterUserInput!): User
        loginUser(input: LoginUserInput!): AuthTokens
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
        },

        async loginUser(_, { input }, { dataSources }) {
            const user = await dataSources.user.getOne('email', input.email)
            if (!user) {
                throw new Error('User with the provided email does not exist.')
            }

            const passwordMatched = await bcrypt.compare(input.password, user.password)
            if (!passwordMatched) {
                throw new Error('Incorrect password provided.')
            }

            // TODO: Have a shorter expiration time once OAuth 2.0 has been implemented
            const accessToken = jwt.sign({
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET, { expiresIn: '1d' })
            return {
                accessToken
            }
        }
    }
}
