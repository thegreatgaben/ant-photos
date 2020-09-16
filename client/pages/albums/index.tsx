import AlbumList from '../../components/albums/AlbumList';
import {useRouter} from 'next/router';

export async function getStaticProps() {
    return {
        props: { apiUrl: process.env.NEXT_PUBLIC_API_URL }
    };
}

export default function Albums() {
    const router = useRouter();
    return (
        <AlbumList routerParams={router.query}/>
    )
}
