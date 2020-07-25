import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import '../styles/global.css'

function createApolloClient() {
    return new ApolloClient({
        link: createHttpLink({
            uri: 'http://localhost:4000/',
            fetch: fetch,
        }),
        cache: new InMemoryCache(),
    });
}
const client = createApolloClient();

export default function App({ Component, pageProps }) {
    return (
        // This file has to be in vanilla JS, cause I can't figure out a typing issue with ApolloProvider...
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}
