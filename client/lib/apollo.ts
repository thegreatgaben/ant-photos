import { ApolloClient, InMemoryCache } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'node-fetch';

export function createApolloClient() {
    return new ApolloClient({
        // @ts-ignore
        link: createUploadLink({ uri: process.env.API_URL, fetch }),
        cache: new InMemoryCache(),
    });
}

