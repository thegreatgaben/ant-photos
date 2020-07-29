import PhotoList from "../components/photos/PhotoList";
import {defaultPhotosRequestQuery, getPhotosQuery} from '../components/utils';
import { useQuery } from "@apollo/react-hooks";

export default function Home() {
    const {loading, error, data} = useQuery(getPhotosQuery, { variables: defaultPhotosRequestQuery });
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>There is an error!</div>;

    return (
        <>
            <PhotoList photoList={data.photoList.photos}/>
        </>
    );
}
