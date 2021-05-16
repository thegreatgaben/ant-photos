import gql from 'graphql-tag'

export const registerUserMutation = gql`
    mutation RegisterUser(
        $name: String!, 
        $email: String!, 
        $password: String!,
        $confirmPassword: String!
    ) {
        registerUser(input: {
            name: $name,
            email: $email,
            password: $password,
            confirmPassword: $confirmPassword
        }) {
            id
        }
    }
`
