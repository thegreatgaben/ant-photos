import gql from 'graphql-tag';

export const defaultPhotosRequestQuery = {pageSize: 10};

export const getPhotosQuery = gql`
    query ($pageSize: Int, $after: String, $albumId: ID) {
        photoList(pageSize: $pageSize, after: $after, albumId: $albumId) {
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
