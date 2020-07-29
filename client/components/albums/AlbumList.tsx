import gql from "graphql-tag";
import {useState} from "react";
import {useQuery} from "@apollo/react-hooks";
import {Card, Row, Col, Empty} from "antd";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import EditAlbumModal from "./EditAlbumModal";
import DeleteAlbumConfirm from "./DeleteAlbumConfirm";

import style from './AlbumList.module.scss';

export const defaultRequestQuery = {pageSize: 10};

export const albumsQuery = gql`
    query ($pageSize: Int, $after: String) {
        photoAlbumList(pageSize: $pageSize, after: $after) {
            cursor
            albums {
                id
                name
                description
            }
        }
    }
`;

export default function AlbumList() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [albumToEdit, setAlbumToEdit] = useState({});

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState({});

    const [query, setQuery] = useState(defaultRequestQuery);
    const {loading, error, data} = useQuery(albumsQuery, { variables: query });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>There is an error!</div>;

    const albumList = data.photoAlbumList.albums;

    return (
        <>
            {
                albumList.length === 0 ?
                <Empty 
                    className={style.albumListEmpty}
                    image="/images/photos_empty.svg"
                    description="Keep all your important moments in life organized through albums. Create an album now."
                />
                :
                <>
                    <EditAlbumModal 
                        visible={showEditModal} 
                        setVisibility={(flag) => setShowEditModal(flag)}
                        album={albumToEdit}
                    />
                    <DeleteAlbumConfirm
                        visible={showDeleteModal} 
                        setVisibility={(flag) => setShowDeleteModal(flag)}
                        album={albumToDelete}
                    />
                    <Row gutter={16}>
                        {albumList.map(album => {
                            return (
                                <Col span={6} key={album.id}>
                                    <Card 
                                        hoverable 
                                        style={{ marginBottom: 16 }}
                                        cover={<img alt="Album Cover Placeholder" src="/images/album_placeholder.jpg"/>}
                                        actions={[
                                            <EditOutlined onClick={() => {
                                                setAlbumToEdit(album);
                                                setShowEditModal(true);
                                            }}/>,
                                            <DeleteOutlined onClick={() => {
                                                setAlbumToDelete(album);
                                                setShowDeleteModal(true);
                                            }}/>,
                                        ]}
                                    >
                                        <Card.Meta title={album.name} description={album.description} />
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </>
            }
        </>
    );
}
