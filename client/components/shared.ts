import gql from 'graphql-tag';
import {GetPaginatedPhotoListVariables} from './types/GetPaginatedPhotoList';

export const defaultPhotosRequestQuery: GetPaginatedPhotoListVariables = {pageSize: 10};

export const getPhotosQuery = gql`
    query GetPaginatedPhotoList($pageSize: Int, $after: String, $albumId: ID, $startDate: String, $endDate: String) {
        photoList(pageSize: $pageSize, after: $after, albumId: $albumId, startDate: $startDate, endDate: $endDate) {
            cursor
            photos {
                id
                filename
                mimetype
                url
                caption
                albumId
            }
        }
    }
`;
