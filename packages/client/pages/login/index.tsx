import LoginForm from '../../components/auth/LoginForm'

export async function getStaticProps() {
    return {
        props: { apiUrl: process.env.NEXT_PUBLIC_API_URL }
    };
}

export default function LoginUser() {
    return (
        <>
            <h1>Login</h1>
            <LoginForm/>
        </>
    )
}
