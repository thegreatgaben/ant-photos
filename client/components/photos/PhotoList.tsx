import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useState } from 'react';

import style from './PhotoList.module.scss';
import {Empty} from 'antd';

export const defaultRequestQuery = {pageSize: 10};

export const getPhotosQuery = gql`
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
    const [query, setQuery] = useState(defaultRequestQuery);
    const {loading, error, data} = useQuery(getPhotosQuery, { variables: query });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>There is an error!</div>;

    const photoList = data.photoList.photos;

    return (
        <>
            {
                photoList.length === 0 ?
                <Empty 
                    className={style.photoListEmpty}
                    image="/images/photos_empty.svg"
                    description="Put all your memories in a safe place here. Upload some photos now."
                />
                :
                <div className={style.photoListContainer}>
                    {photoList.map(photo => { 
                        return <img key={photo.id} className={style.photoItem} src={photo.url}/>
                    })}
                </div>
            }
        </>
    );
}

export default PhotosList;
