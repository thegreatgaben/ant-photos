import { ApolloClient, InMemoryCache } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'node-fetch';
import { setContext } from '@apollo/client/link/context'
import { getAccessToken } from '../components/auth/utils'

const authLink = setContext((_, { headers }) => {
    const token = getAccessToken()
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

export function createApolloClient(apiUrl) {
    return new ApolloClient({
        // @ts-ignore
        link: authLink.concat(createUploadLink({ uri: apiUrl, fetch })),
        cache: new InMemoryCache(),
    });
}

