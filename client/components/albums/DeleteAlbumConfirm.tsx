import {message, Modal, Typography, Checkbox, Button} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {ModalProps} from 'antd/lib/modal';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {defaultRequestQuery, albumsQuery} from './AlbumList';
import {useState} from 'react';

import style from './DeleteAlbumConfirm.module.scss';

interface DeleteAlbumConfirmProps extends ModalProps{
    setVisibility: (flag: boolean) => void;
    // TODO: Type album
    album: any;
}

const { Text } = Typography;

const deleteAlbumMutation = gql`
    mutation DeletePhotoAlbum($id: ID!, $deletePhotos: Boolean) {
        deletePhotoAlbum(id: $id, deletePhotos: $deletePhotos)
    }
`;

export default function DeleteAlbumConfirm({ setVisibility, album, ...props }: DeleteAlbumConfirmProps) {
    const [deleteAlbum] = useMutation(deleteAlbumMutation, {
        refetchQueries: [{ query: albumsQuery, variables: defaultRequestQuery}],
        onCompleted: () => {
            message.success('Album deleted successfully');
            setVisibility(false)
        },
        onError: () => {
            message.error('An error occured in the server'); 
            setVisibility(false);
        }
    })
    const [deleteAlbumPhotos, setDeleteAlbumPhotos] = useState(false);

    const handleDelete = () => {
        deleteAlbum({ variables: {id: album.id, deletePhotos: deleteAlbumPhotos} });
    }

    return (
        <Modal
            {...props}
            width={416}
            closable={false}
            footer={null}
            onCancel={() => setVisibility(false)}
        >
            <div className={style.deleteModalBody}>
                <div className={style.warningIcon}>
                    <ExclamationCircleOutlined/>
                </div>
                <div>
                    <Text className={style.title}>
                        Are you sure you want to delete
                        <Text strong> {album.name}</Text>?
                    </Text>
                    
                    <div className={style.extra}>
                        <Text>Would you also like to delete the photos in it?</Text>
                        <Checkbox onChange={() => setDeleteAlbumPhotos(true)}></Checkbox>
                    </div>

                    <div className={style.actions}>
                        <Button onClick={() => setVisibility(false)}>Cancel</Button>
                        <Button className={style.submit} type="primary" onClick={handleDelete}>Ok</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
