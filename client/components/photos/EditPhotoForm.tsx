import {Form, Input, Select} from "antd";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

const getPhotoAlbums = gql`
    query GetPhotoAlbumList {
        photoAlbumList {
            albums {
                id
                name
            }
        }
    }
`

export default function EditPhotoForm({ form }) {
    const { data } = useQuery(getPhotoAlbums);
    const albumList = data ? data.photoAlbumList.albums : [];

    const handleAlbumChange = albumId => {
        form.setFieldsValue({ albumId });
    }

    return (
        <Form
            className="mt-3"
            {...layout}
            form={form}
            name="photo-form"
        >
            <Form.Item
                className="mr-3"
                label="Caption"
                name="caption"
                rules={[
                    {
                        required: true,
                        message: 'Please input the photo\'s caption!',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                className="mr-3"
                label="Album"
                name="albumId"
            >
                <Select onChange={handleAlbumChange} allowClear>
                    {albumList.map(album => {
                        return (
                            <Select.Option key={album.id} value={album.id}>{album.name}</Select.Option>
                        );
                    })}
                </Select>
            </Form.Item>
        </Form> 
    )
}
