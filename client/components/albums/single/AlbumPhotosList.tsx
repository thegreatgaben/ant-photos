import PhotosList from "../../photos/PhotoList";
import {defaultPhotosRequestQuery, getPhotosQuery} from "../../utils";
import {Typography} from "antd";
import {useLazyQuery} from "@apollo/react-hooks";
import {useEffect} from "react";

const { Title } = Typography;

export default function AlbumPhotosList({ album }) {
    const [getAlbumPhotos, {called, loading, error, data}] = useLazyQuery(getPhotosQuery);

    useEffect(() => {
        if (album.id) {
            const query = {
                ...defaultPhotosRequestQuery,
                albumId: album.id,
            };
            getAlbumPhotos({ variables: query });
        }
    }, [album]);

    if (called && loading) return <div>Loading...</div>;
    if (called && error) return <div>There is an error!</div>;

    const photoList = data ? data.photoList.photos : [];

    return (        
        <>
            <Title>{album.name}</Title>
            <PhotosList photoList={photoList}/>
        </>
    );
}
