import gql from 'graphql-tag'

export const loginUserMutation = gql`
    mutation LoginUser(
        $email: String!,
        $password: String!
    ) {
        loginUser(input: {
            email: $email,
            password: $password
        }) {
            accessToken
        }
    }
`
