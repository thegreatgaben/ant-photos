import {useRouter} from "next/router";
import AlbumPhotosList from '../../components/albums/single/AlbumPhotosList';

export default function AlbumPhotos() {
    const router = useRouter();

    return (
        <>
            <AlbumPhotosList album={router.query}/>
        </>
    );
}
