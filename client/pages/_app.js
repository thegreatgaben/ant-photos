import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from '@apollo/react-hooks';

import '../styles/global.css'

function createApolloClient() {
    return new ApolloClient({
        link: createUploadLink({ uri: 'http://localhost:4000/graphql' }),
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
