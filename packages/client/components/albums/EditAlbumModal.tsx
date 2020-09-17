import { message, Modal, Form } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import AlbumForm from './AlbumForm';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {albumsQuery, defaultRequestQuery} from './AlbumList';
import {useEffect} from 'react';

interface EditAlbumModalProps extends ModalProps {
    setVisibility: (flag: boolean) => void;
    // TODO: Type album
    album: any;
}

const updateAlbumMutation = gql`
    mutation UpdatePhotoAlbum($id: ID!, $name: String!, $description: String!) {
        updatePhotoAlbum(id: $id, input: {name: $name, description: $description}) {
            id
            name
            description
        }
    }
`

export default function EditAlbumModal({setVisibility, album, ...props}: EditAlbumModalProps) {
    const [updateAlbum] = useMutation(updateAlbumMutation, {
        refetchQueries: [{ query: albumsQuery, variables: defaultRequestQuery }],
        onCompleted: () => {
            message.success('Album updated successfully');
            setVisibility(false);
        }
    });
    const [form] = Form.useForm();

    const handleFormSubmit = async () => {
        const values = await form.validateFields();
        updateAlbum({ variables: {id: album.id, ...values} })
    }

    useEffect(() => {
        form.setFieldsValue(album);
    }, [album]);

    return (
        <Modal 
            title="Edit Album"
            width={720} 
            onCancel={() => setVisibility(false)} 
            {...props}
            okText="Update"
            onOk={handleFormSubmit}
        >                    
            <AlbumForm form={form}/>
        </Modal>
    )
}
