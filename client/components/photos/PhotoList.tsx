import {message, Empty, Modal, Form} from 'antd';

import style from './PhotoList.module.scss';
import {useState, useEffect} from 'react';
import EditPhotoForm from './EditPhotoForm';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

const updatePhotoMutation = gql`
    mutation UpdatePhoto($id: ID!, $caption: String!) {
        updatePhoto(id: $id, input: {caption: $caption}) {
            id
            caption
        }
    }
`;

export default function PhotosList({ photoList, fetchQueries }) {
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoToShow, setPhotoToShow] = useState({});
    const [updatePhoto] = useMutation(updatePhotoMutation, {
        refetchQueries: fetchQueries,
        onCompleted: () => {
            message.success('Photo updated successfully');
            setShowPhotoModal(false)
        },
    });

    useEffect(() => {
        form.setFieldsValue(photoToShow);
    }, [photoToShow]);

    const [form] = Form.useForm();
    const handlePhotoUpdate = async () => {
        const values = await form.validateFields();
        //@ts-ignore
        updatePhoto({ variables: { id: photoToShow.id, caption: values.caption } });
    }

    return (
        <>
            <Modal
                width={720}
                style={{ top: 20 }}
                visible={showPhotoModal}
                onCancel={() => setShowPhotoModal(false)}
                okText="Update"
                onOk={handlePhotoUpdate}
                closable={false}
            >
                <img src={photoToShow.url}/>
                <EditPhotoForm form={form}/>
            </Modal>
            {
                photoList.length === 0 ?
                <Empty 
                    className={style.photoListEmpty}
                    image="/images/photos_empty.svg"
                    description="Put all your memories in a safe place here. Upload some photos now."
                />
                :
                <div className={style.photoListContainer}>
                    {photoList.map(photo => { 
                        return (
                            <div className={style.photoItem} onClick={() => {
                                    setPhotoToShow(photo);
                                    setShowPhotoModal(true);
                                }}
                            >
                                <img key={photo.id} src={photo.url}/>
                            </div>
                        )
                    })}
                </div>
            }
        </>
    );
}
