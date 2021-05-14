import { gql } from 'apollo-server-express';

const graphQLTypes = gql`
    type PhotoAlbum {
        id: ID!
        name: String!
        description: String!
        coverPhotoUrl: String
    }

    type PhotoAlbumConnection { 
      cursor: String!
      albums: [PhotoAlbum]!
    }

    type Photo {
        id: ID!
        filename: String!
        filepath: String!
        filesize: Int
        disk: String!
        mimetype: String!
        url: String!
        caption: String
        albumId: ID
        favorite: Boolean
    }

    type PhotoConnection {
        cursor: String!
        photos: [Photo]!
    }

    type Query {
        photoAlbumList( 
            pageSize: Int
            after: String
            search: String
        ): PhotoAlbumConnection!
        photoList(
            pageSize: Int
            after: String
            albumId: ID
            startDate: String
            endDate: String
            favorite: Boolean
        ): PhotoConnection!
    }

    input PhotoAlbumInput {
        name: String!
        description: String!
    }

    input PhotoInput {
        caption: String
        albumId: ID
    }

    type PhotoUploadedResponse {
        filename: String!
        uploaded: Boolean!
    }

    type Mutation {
        createPhotoAlbum(input: PhotoAlbumInput!): PhotoAlbum
        updatePhotoAlbum(id: ID!, input: PhotoAlbumInput!): PhotoAlbum
        deletePhotoAlbum(id: ID!, deletePhotos: Boolean): Boolean

        uploadPhotos(files: [Upload]!, albumId: ID): [PhotoUploadedResponse]
        updatePhoto(id: ID!, input: PhotoInput!): Photo
        deletePhoto(id: ID): Boolean

    }
`;

export default graphQLTypes;
