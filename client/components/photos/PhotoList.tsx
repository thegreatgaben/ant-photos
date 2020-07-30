import {message, Empty, Modal, Form, Button, Popconfirm} from 'antd';

import style from './PhotoList.module.scss';
import {useState, useEffect} from 'react';
import EditPhotoForm from './EditPhotoForm';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import InfiniteScroll from 'react-infinite-scroll-component';

const updatePhotoMutation = gql`
    mutation UpdatePhoto($id: ID!, $caption: String!, $albumId: ID) {
        updatePhoto(id: $id, input: {caption: $caption, albumId: $albumId}) {
            id
            caption
        }
    }
`;

const deletePhotoMutation = gql`
    mutation DeletePhoto($id: ID!) {
        deletePhoto(id: $id)
    }
`;

export default function PhotosList({ photoListResponse, fetchQueries, fetchMore }) {
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoToShow, setPhotoToShow] = useState({});
    const [updatePhoto] = useMutation(updatePhotoMutation, {
        refetchQueries: fetchQueries,
        onCompleted: () => {
            message.success('Photo updated successfully');
            setShowPhotoModal(false)
        },
        onError: () => {
            message.error('An error occured in the server');
            setShowPhotoModal(false)
        }
    });
    const [deletePhoto] = useMutation(deletePhotoMutation, {
        refetchQueries: fetchQueries,
        onCompleted: () => {
            message.success('Photo deleted successfully');
            setShowPhotoModal(false)
        },
        onError: () => {
            message.error('An error occured in the server');
            setShowPhotoModal(false)
        }
    });

    useEffect(() => {
        form.setFieldsValue(photoToShow);
    }, [photoToShow]);

    const [form] = Form.useForm();
    const handlePhotoUpdate = async () => {
        const values = await form.validateFields();
        //@ts-ignore
        updatePhoto({ variables: { ...values, id: photoToShow.id } });
    }
    
    const onConfirmDelete = () => {
        //@ts-ignore
        deletePhoto({ variables: { id: photoToShow.id } });
        setShowPhotoModal(false);
    }

    return (
        <>
            <Modal
                width={720}
                style={{ top: 20 }}
                visible={showPhotoModal}
                onCancel={() => setShowPhotoModal(false)}
                closable={false}
                footer={
                    <>
                        <Button onClick={() => setShowPhotoModal(false)}>Cancel</Button>
                        <Popconfirm 
                            title="Are you sure you want to delete this photo?" 
                            onConfirm={onConfirmDelete}
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                        <Button type="primary" onClick={handlePhotoUpdate}>Update</Button>
                    </>
                }
            >
                <img src={photoToShow.url}/>
                <EditPhotoForm form={form}/>
            </Modal>
            {
                photoListResponse.photos.length === 0 ?
                <Empty 
                    className={style.photoListEmpty}
                    image="/images/photos_empty.svg"
                    description="Put all your memories in a safe place here. Upload some photos now."
                />
                :
                <InfiniteScroll 
                    dataLength={photoListResponse.photos.length} 
                    next={() => fetchMore()}
                    hasMore={photoListResponse.cursor && photoListResponse.cursor !== ''} 
                    loader={<div>Loading...</div>}
                    endMessage={<div>You have reached the end!</div>}
                >
                    <div className={style.photoListContainer}>
                        {photoListResponse.photos.map(photo => { 
                            return (
                                <div key={photo.id} className={style.photoItem} onClick={() => {
                                        setPhotoToShow(photo);
                                        setShowPhotoModal(true);
                                    }}
                                >
                                    <img src={photo.url}/>
                                </div>
                            )
                        })}
                    </div>
                </InfiniteScroll>
            }
        </>
    );
}
