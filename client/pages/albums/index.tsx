import AlbumList from '../../components/albums/AlbumList';
import {useRouter} from 'next/router';

export default function Albums() {
    const router = useRouter();
    return (
        <AlbumList routerParams={router.query}/>
    )
}
