import gql from "graphql-tag";
import {useState} from "react";
import {useQuery} from "@apollo/react-hooks";
import {Card, Row, Col, Empty, Button} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import CreateAlbumModal from './CreateAlbumModal';
import EditAlbumModal from "./EditAlbumModal";
import DeleteAlbumConfirm from "./DeleteAlbumConfirm";

import style from './AlbumList.module.scss';
import {useRouter} from 'next/router';

export const defaultRequestQuery = {pageSize: 10};

export const albumsQuery = gql`
    query ($pageSize: Int, $after: String) {
        photoAlbumList(pageSize: $pageSize, after: $after) {
            cursor
            albums {
                id
                name
                description
                coverPhotoUrl
            }
        }
    }
`;

export default function AlbumList() {
    const router = useRouter();

    const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);

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
            <div className="d-flex justify-content-end mb-3">
                <Button icon={<PlusOutlined/>} type="primary" onClick={() => setShowCreateAlbumModal(true)}>
                    Create Album
                </Button>
            </div>

            <CreateAlbumModal 
                visible={showCreateAlbumModal}
                setVisibility={(flag) => setShowCreateAlbumModal(flag)}
            />

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
                                        cover={
                                            <img 
                                                onClick={() => router.push(`/albums/${album.id}?name=${album.name}`)}
                                                alt={album.name} 
                                                src={album.coverPhotoUrl || "/images/album_placeholder.jpg"}
                                            />
                                        }
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
                                        <Card.Meta 
                                            // @ts-ignore
                                            onClick={() => router.push(`/albums/${album.id}?name=${album.name}`)}
                                            title={album.name} 
                                            description={album.description} 
                                        />
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
