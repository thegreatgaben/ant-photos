import {ApolloProvider} from '@apollo/react-hooks';
import AppLayout from '../components/AppLayout';
import {createApolloClient} from '../lib/apollo';

import '../styles/global.css'

export default function App({ Component, pageProps }) {     
    const client = createApolloClient(pageProps.apiUrl);

    return (
        <ApolloProvider client={client}>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </ApolloProvider>
    )
}
