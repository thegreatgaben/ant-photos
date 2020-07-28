import { message, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import PhotoUpload from './PhotoUpload';

interface UploadModalProps extends ModalProps {
    setVisibility: (flag: boolean) => void;
}

export default function UploadModal({setVisibility, ...props}: UploadModalProps) {
    return (
        <Modal 
            title="Photos Upload"
            width={720} 
            onOk={() => setVisibility(false)}
            onCancel={() => setVisibility(false)} 
            footer={null}
            {...props}
        >                    
            <PhotoUpload onUploadFinish={(status, response) => {
                // TODO: Type the response
                if (status) {
                    let allUploadSuccess = true;
                    // Notify any uploads that failed
                    response.uploadPhotos.forEach(photo => {
                        if(!photo.uploaded) {
                            allUploadSuccess = false;
                            message.error(`${photo.filename} failed to upload`)
                        }
                    });
                    if (allUploadSuccess) message.success('Photos uploaded successfully')
                }
                else {
                    message.error('An error occured in the server.');
                }
                setVisibility(false)
            }}/>
        </Modal>
    )
}
