import {Form, Input} from "antd";

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

export default function EditPhotoForm({ form }) {
    return (
        <Form
            className="mt-3"
            {...layout}
            form={form}
            name="photo-form"
        >
            <Form.Item
                className="mr-3"
                label="Caption"
                name="caption"
                rules={[
                    {
                        required: true,
                        message: 'Please input the photo\'s caption!',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
        </Form> 
    )
}
