import {useState} from 'react';
import {defaultPhotosRequestQuery, getPhotosQuery} from "../../utils";
import {message, Typography, Button, Modal} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import {useLazyQuery} from "@apollo/react-hooks";
import {useEffect} from "react";

import PhotosList from "../../photos/PhotoList";
import PhotoUpload from '../../photos/PhotoUpload';

const { Title } = Typography;

export default function AlbumPhotosList({ album }) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [getAlbumPhotos, {called, loading, error, data, fetchMore}] = useLazyQuery(getPhotosQuery);

    useEffect(() => {
        if (album.id) {
            const query = {
                ...defaultPhotosRequestQuery,
                albumId: album.id,
            };
            getAlbumPhotos({ variables: query });
        }
    }, [album]);

    if (called && loading) return <div>Loading...</div>;
    if (called && error) return <div>There is an error!</div>;

    const photoListResponse = data ? data.photoList : { photos: [] }
    const fetchQueries = [{ query: getPhotosQuery, variables: {...defaultPhotosRequestQuery, albumId: album.id } }];
    const uploadExtraVars = { albumId: album.id };
    const handleFetchMore = () => {
        fetchMore({
            query: getPhotosQuery,
            variables: { ...defaultPhotosRequestQuery, after: photoListResponse.cursor, albumId: album.id },
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
            <Title>{album.name}</Title>

            <div className="d-flex justify-content-end align-items-center mb-3">
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
                <PhotoUpload 
                    extraVariables={uploadExtraVars} 
                    fetchQueries={fetchQueries} 
                    onUploadFinish={(status, response) => {
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
                    }}
                />
            </Modal>

            <PhotosList 
                photoListResponse={photoListResponse}
                fetchQueries={fetchQueries}
                fetchMore={handleFetchMore}
            />
        </>
    );
}
