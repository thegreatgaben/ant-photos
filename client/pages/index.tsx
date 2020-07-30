import {useState, useEffect} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {message, Button, Modal} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

import PhotoList from "../components/photos/PhotoList";
import PhotoUpload from '../components/photos/PhotoUpload';
import {defaultPhotosRequestQuery, getPhotosQuery} from '../components/utils';

export default function Home() {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [getPhotos, {called, loading, error, data, fetchMore}] = useLazyQuery(getPhotosQuery);

    useEffect(() => {
        getPhotos({ variables: defaultPhotosRequestQuery });
    }, []);
    
    if (called && loading) return <div>Loading...</div>;
    if (called && error) return <div>There is an error!</div>;


    const fetchQueries = [{ query: getPhotosQuery, variables: defaultPhotosRequestQuery }];
    const photoListResponse = data ? data.photoList : { photos: [] }
    const handleFetchMore = () => {
        fetchMore({
            query: getPhotosQuery,
            variables: { ...defaultPhotosRequestQuery, after: photoListResponse.cursor },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const previousPhotos = previousResult.photoList.photos;
                const newPhotos = fetchMoreResult.photoList.photos;
                fetchMoreResult.photoList.photos = [
                    ...previousPhotos,
                    ...newPhotos,
                ]
                return fetchMoreResult;
            }
        })
    }

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

            <PhotoList 
                photoListResponse={photoListResponse} 
                fetchQueries={fetchQueries} 
                fetchMore={handleFetchMore}
            />
        </>
    );
}
