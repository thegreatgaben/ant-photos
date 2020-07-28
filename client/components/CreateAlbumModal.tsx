import { Modal, Form } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import CreateAlbumForm from './CreateAlbumForm';

interface CreateAlbumModalProps extends ModalProps {
    setVisibility: (flag: boolean) => void;
}

export default function CreateAlbumModal({setVisibility, ...props}: CreateAlbumModalProps) {
    const [form] = Form.useForm();

    const handleFormSubmit = async () => {
        await form.validateFields();
    }

    return (
        <Modal 
            title="Create Album"
            width={720} 
            onCancel={() => setVisibility(false)} 
            {...props}
            destroyOnClose={true}
            okText="Create"
            onOk={handleFormSubmit}
        >                    
            <CreateAlbumForm form={form}/>
        </Modal>
    )
}
