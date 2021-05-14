import { useLazyQuery } from "@apollo/react-hooks";
import { defaultPhotosRequestQuery, getPhotosQuery } from '../../components/shared';
import { GetPaginatedPhotoList_photoList, GetPaginatedPhotoListVariables, GetPaginatedPhotoList } from '../../components/types/GetPaginatedPhotoList';
import PhotoList from '../../components/photos/PhotoList'

import { useEffect } from "react";

export async function getStaticProps() {
    return {
        props: { apiUrl: process.env.NEXT_PUBLIC_API_URL }
    };
}

export default function FavoritePhotos() {
    const params = { ...defaultPhotosRequestQuery, favorite: true }
    const [getPhotos, {called, loading, error, data, fetchMore}] = useLazyQuery<GetPaginatedPhotoList, GetPaginatedPhotoListVariables>(getPhotosQuery);

    useEffect(() => {
        getPhotos({ variables: params })
    }, [])

    if (called && loading) return <div>Loading...</div>;
    if (called && error) return <div>There is an error!</div>;

    const fetchQueries = [{ query: getPhotosQuery, variables: params }];
    const photoListResponse: GetPaginatedPhotoList_photoList = data ? data.photoList : { 
        __typename: "PhotoConnection",
        cursor: '',
        photos: [] 
    }
    const handleFetchMore = () => {
        fetchMore({
            query: getPhotosQuery,
            variables: { ...params, after: photoListResponse.cursor },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const previousPhotos = previousResult.photoList.photos;
                const newPhotos = fetchMoreResult.photoList.photos;
                fetchMoreResult.photoList.photos = [
                    ...previousPhotos,
                    ...newPhotos,
                ]
                return fetchMoreResult;
            }
        })
    }

    return (
        <PhotoList 
            photoListResponse={photoListResponse} 
            fetchQueries={fetchQueries} 
            fetchMore={handleFetchMore}
        />
    )
}
