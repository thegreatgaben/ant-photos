import { message, Modal, Form } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import CreateAlbumForm from './CreateAlbumForm';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {albumsQuery, defaultRequestQuery} from '../pages/albums';

interface CreateAlbumModalProps extends ModalProps {
    setVisibility: (flag: boolean) => void;
}

const createAlbumMutation = gql`
    mutation CreateAlbum($name: String!, $description: String!) {
        createPhotoAlbum(input: {name: $name, description: $description}) {
            id
            name
            description
        }
    }
`

export default function CreateAlbumModal({setVisibility, ...props}: CreateAlbumModalProps) {
    const [createAlbum] = useMutation(createAlbumMutation, {
        refetchQueries: [{ query: albumsQuery, variables: defaultRequestQuery }],
        onCompleted: () => {
            message.success('Album created successfully');
            setVisibility(false);
        }
    });
    const [form] = Form.useForm();

    const handleFormSubmit = async () => {
        const values = await form.validateFields();
        createAlbum({ variables: values })
    }

    return (
        <Modal 
            title="Create Album"
            width={720} 
            onCancel={() => setVisibility(false)} 
            {...props}
            destroyOnClose={true}
            okText="Create"
            onOk={handleFormSubmit}
        >                    
            <CreateAlbumForm form={form}/>
        </Modal>
    )
}
