import { ApolloClient, InMemoryCache } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'node-fetch';

export function createApolloClient(apiUrl) {
    return new ApolloClient({
        // @ts-ignore
        link: createUploadLink({ uri: apiUrl, fetch }),
        cache: new InMemoryCache(),
    });
}

