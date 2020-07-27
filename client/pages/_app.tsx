import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'node-fetch';

import AppLayout from '../components/AppLayout';

import '../styles/global.css'

function createApolloClient() {
    return new ApolloClient({
        // @ts-ignore
        link: createUploadLink({ uri: 'http://localhost:4000/graphql', fetch }),
        cache: new InMemoryCache(),
    });
}
const client = createApolloClient();

export default function App({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </ApolloProvider>
    )
}
