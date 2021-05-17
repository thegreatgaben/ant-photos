import { message, Form, Input, Button } from 'antd'
import { useMutation } from '@apollo/react-hooks'
import { useRouter } from 'next/router'
import { loginUserMutation } from './gql/LoginForm'
import { LoginUser, LoginUserVariables } from './gql/types/LoginUser'
import { setAccessToken } from './util'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export default function LoginForm() {
    const [form] = Form.useForm()
    const router = useRouter()

    const [loginUser] = useMutation(loginUserMutation,  {
        onCompleted(data: LoginUser) {
            const { accessToken } = data.loginUser
            setAccessToken(accessToken)
            message.success('Login successful.')
            router.push('/')
        },
        onError(error) {
            message.error(error.message)
        }
    })

    const onFinish = (values: LoginUserVariables) => {
        loginUser({ variables: { ...values } })
    }

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
        >
            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
    )
}
