import {ApolloProvider} from '@apollo/react-hooks';
import AppLayout from '../components/AppLayout';
import {createApolloClient} from '../lib/apollo';

import '../styles/global.css'

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
