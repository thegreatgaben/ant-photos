import {ApolloProvider} from '@apollo/react-hooks';
import AppLayout from '../components/AppLayout';
import {createApolloClient} from '../lib/apollo';
import { useRouter } from 'next/router'
import { message } from 'antd'

import '../styles/global.css'

export default function App({ Component, pageProps }) {     
    const router = useRouter()
    const client = createApolloClient(pageProps.apiUrl, ({ graphQLErrors, networkError }) => {
        if (graphQLErrors.length > 0 && graphQLErrors[0].message === 'Not Authorised!') {
            message.error(graphQLErrors[0].message)
            router.push('/login')
        } 
    });
    const authPathnames = ['/register', '/login']

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
