import { ApolloClient, InMemoryCache } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'node-fetch';

export function createApolloClient() {
    return new ApolloClient({
        // @ts-ignore
        link: createUploadLink({ uri: 'http://localhost:4000/graphql', fetch }),
        cache: new InMemoryCache(),
    });
}

