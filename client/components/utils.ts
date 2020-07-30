import gql from 'graphql-tag';

export const defaultPhotosRequestQuery = {pageSize: 10};

export const getPhotosQuery = gql`
    query ($pageSize: Int, $after: String, $albumId: ID, $startDate: String, $endDate: String) {
        photoList(pageSize: $pageSize, after: $after, albumId: $albumId, startDate: $startDate, endDate: $endDate) {
            cursor
            photos {
                id
                filename
                mimetype
                url
                caption
            }
        }
    }
`;
