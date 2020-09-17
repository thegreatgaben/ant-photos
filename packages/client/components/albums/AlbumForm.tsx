import { Form, Input, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';

interface AlbumFormProps {
    form: FormInstance;
}

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

export default function AlbumForm({ form }: AlbumFormProps) {
    return (
        <Form
            {...layout}
            form={form}
            name="album-form"
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input the album\'s name!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[
                    {
                        required: true,
                        message: 'Please input the album\'s description!',
                    },
                ]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>
        </Form>
    );
};
