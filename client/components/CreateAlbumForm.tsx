import { Form, Result, Input, Typography, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { CloseCircleOutlined } from '@ant-design/icons';

import PhotoUpload from './PhotoUpload';
import {useState} from 'react';

const { Paragraph, Text } = Typography;

interface CreateAlbumFormProps {
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

export default function CreateAlbumForm({ form }: CreateAlbumFormProps) {
    const [showUploadResult, setShowUploadResult] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [failedPhotos, setFailedPhotos] = useState([]);

    return (
        <Form
            {...layout}
            form={form}
            name="create-album"
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

            {
                showUploadResult ?
                <Result
                    status={uploadSuccess ? 'success' : 'error'}
                    title={uploadSuccess ? 'All Photos uploaded successfully!' : 'Upload failed'}
                    subTitle={uploadSuccess ? 
                        'Go ahead and click the Create button below.' 
                        : 'Some photos did not get uploaded successfully. You may still go ahead and create an album first.'
                    }
                    extra={uploadSuccess ? [] 
                        : [<Button type="primary" onClick={() => setShowUploadResult(false)}>Try Again</Button>]
                    }
                >
                    <Paragraph>
                        <Text strong style={{ fontSize: 16 }}>
                            The following photos failed to get uploaded:
                        </Text>
                    </Paragraph> 
                    {
                        failedPhotos.map(photo => {
                            return (
                                <Paragraph>
                                    <CloseCircleOutlined style={{ color: 'red', marginRight: 10 }} /> 
                                    <span>{photo.filename}</span>
                                </Paragraph>
                            );
                        })
                    }
                </Result>
                :
                <PhotoUpload skipRefetch={true} onUploadFinish={(status, response) => {
                    if (status) {
                        let allUploadSuccess = true;
                        let failures = [];
                        // Notify any uploads that failed
                        response.uploadPhotos.forEach(photo => {
                            if(!photo.uploaded) {
                                allUploadSuccess = false;
                                failures.push(photo);
                            }
                        });
                        if (allUploadSuccess) setUploadSuccess(true);
                        else setFailedPhotos(failures);
                    }
                    setShowUploadResult(true);
                }}/>
            }

        </Form>
    );
};
