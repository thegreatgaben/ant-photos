import {useRouter} from "next/router";
import AlbumPhotosList from '../../components/albums/single/AlbumPhotosList';

export async function getServerSideProps() {
    return {
        props: { apiUrl: process.env.NEXT_PUBLIC_API_URL }
    };
}

export default function AlbumPhotos() {
    const router = useRouter();

    return (
        <>
            <AlbumPhotosList album={router.query}/>
        </>
    );
}
