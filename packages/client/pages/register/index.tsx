import RegisterForm from '../../components/auth/RegisterForm'

export async function getStaticProps() {
    return {
        props: { apiUrl: process.env.NEXT_PUBLIC_API_URL }
    };
}

export default function RegisterUser() {
    return (
        <>
            <h1>Register</h1>
            <RegisterForm/>
        </>
    )
}
