import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import {useState} from 'react';

import style from './PhotoList.module.scss';

const getPhotosQuery = gql`
    query ($pageSize: Int, $after: String) {
        photoList(pageSize: $pageSize, after: $after) {
            cursor
            photos {
                id
                filename
                mimetype
                url
            }
        }
    }
`;

const PhotosList = () => {
    const [query, setQuery] = useState({pageSize: 10});
    const {loading, error, data} = useQuery(getPhotosQuery, { variables: query });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>There is an error!</div>;

    const photoList = data.photoList.photos;

    return (
        <div className={style.photoListContainer}>
            {photoList.map(photo => { 
                return <img style={{height: 250, padding: 10}} src={`http://${photo.url}`}/>
            })}
        </div>
    );
}

export default PhotosList;
