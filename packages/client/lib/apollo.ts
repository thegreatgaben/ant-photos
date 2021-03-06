import { ApolloClient, InMemoryCache, from } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'node-fetch';
import { setContext } from '@apollo/client/link/context'
import { onError, ErrorHandler } from '@apollo/client/link/error'
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

export function createApolloClient(apiUrl: string, errorHandler: ErrorHandler) {
    return new ApolloClient({
        // @ts-ignore
        link: from([onError(errorHandler), authLink, createUploadLink({ uri: apiUrl, fetch })]),
        cache: new InMemoryCache(),
    });
}

