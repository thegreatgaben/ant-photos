import {message, Modal, Typography, Checkbox, Button} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {ModalProps} from 'antd/lib/modal';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {defaultRequestQuery, albumsQuery} from './AlbumList';

interface DeleteAlbumConfirmProps extends ModalProps{
    setVisibility: (flag: boolean) => void;
    // TODO: Type album
    album: any;
}

const { Text } = Typography;

const deleteAlbumMutation = gql`
    mutation DeleteAlbum($id: ID!, $deletePhotos: Boolean) {
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
    })

    const handleDelete = () => {
        deleteAlbum({ variables: album });
    }

    return (
        <Modal
            {...props}
            width={416}
            closable={false}
            footer={null}
            onCancel={() => setVisibility(false)}
        >
            <div style={{ display: 'flex', padding: 10 }}>
                <div style={{ marginRight: 16 }}>
                    <ExclamationCircleOutlined style={{ fontSize: 22, color: '#faad14' }}/>
                </div>
                <div>
                    <Text style={{ fontSize: 16 }}>
                        Are you sure you want to delete
                        <Text strong> {album.name}</Text>?
                    </Text>
                    
                    <div style={{ marginTop: 10, marginBottom: 20 }}>
                        <Text>Would you also like to delete the photos in it?</Text>
                        <Checkbox style={{ marginLeft: 10 }}></Checkbox>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button onClick={() => setVisibility(false)}>Cancel</Button>
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={handleDelete}>Ok</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
