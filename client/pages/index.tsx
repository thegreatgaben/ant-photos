import {useState} from 'react';
import { useQuery } from "@apollo/react-hooks";
import {message, Button, Modal} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

import PhotoList from "../components/photos/PhotoList";
import PhotoUpload from '../components/photos/PhotoUpload';
import {defaultPhotosRequestQuery, getPhotosQuery} from '../components/utils';

export default function Home() {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const {loading, error, data} = useQuery(getPhotosQuery, { variables: defaultPhotosRequestQuery });
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>There is an error!</div>;

    const fetchQueries = [{ query: getPhotosQuery, variables: defaultPhotosRequestQuery }];

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <Button icon={<UploadOutlined/>} type="primary" onClick={() => setShowUploadModal(true)}>
                    Upload
                </Button>
            </div>

            <Modal 
                title="Photos Upload"
                width={720} 
                visible={showUploadModal}
                onCancel={() => setShowUploadModal(false)} 
                footer={null}
            >                    
                <PhotoUpload fetchQueries={fetchQueries} onUploadFinish={(status, response) => {
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
                    setShowUploadModal(false)
                }}/>
            </Modal>

            <PhotoList photoList={data.photoList.photos} fetchQueries/>
        </>
    );
}
