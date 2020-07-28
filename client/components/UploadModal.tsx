import { message, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import PhotoUpload from './PhotoUpload';

interface UploadModalProps extends ModalProps {
    setVisibility: (flag: boolean) => void;
}

export default function UploadModal({setVisibility, ...props}: UploadModalProps) {
    return (
        <Modal 
            title="Photo Upload"
            width={720} 
            onOk={() => setVisibility(false)}
            onCancel={() => setVisibility(false)} 
            footer={null}
            {...props}
        >                    
            <PhotoUpload onUploadFinish={(status, response) => {
                if (status) message.success('Photos uploaded successfully');
                else {
                    response.uploadPhotos.forEach(photo => {
                        if(!photo.uploaded) message.error(`${photo.filename} failed to upload`)
                    });
                }
                setVisibility(false)
            }}/>
        </Modal>
    )
}
