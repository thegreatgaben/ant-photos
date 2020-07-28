import gql from "graphql-tag";
import {useState} from "react";
import {useQuery} from "@apollo/react-hooks";
import {Card, Row, Col} from "antd";

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

export default function Albums() {
    const [query, setQuery] = useState(defaultRequestQuery);
    const {loading, error, data} = useQuery(albumsQuery, { variables: query });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>There is an error!</div>;

    const albumList = data.photoAlbumList.albums;

    return (
        <Row gutter={16}>
            {albumList.map(album => {
                return (
                    <Col span={6} key={album.id}>
                        <Card 
                            hoverable 
                            style={{ marginBottom: 16 }}
                            cover={<img alt="Album Cover Placeholder" src="/images/album_placeholder.jpg"/>}
                        >
                            <Card.Meta title={album.name} description={album.description} />
                        </Card>
                    </Col>
                )
            })}
        </Row>
    );
}
