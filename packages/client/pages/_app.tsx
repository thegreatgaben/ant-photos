import {ApolloProvider} from '@apollo/react-hooks';
import AppLayout from '../components/AppLayout';
import {createApolloClient} from '../lib/apollo';
import { useRouter } from 'next/router'

import '../styles/global.css'

export default function App({ Component, pageProps }) {     
    const client = createApolloClient(pageProps.apiUrl);
    const router = useRouter()
    const authPathnames = ['/register']

    return (
        <ApolloProvider client={client}>
            {
                authPathnames.includes(router.pathname) ?
                    <Component {...pageProps} />
                    :
                    <AppLayout>
                        <Component {...pageProps} />
                    </AppLayout>
            }
        </ApolloProvider>
    )
}
