const { gql } = require('apollo-server-express');

const graphQLTypes = gql`
    type PhotoAlbum {
        id: ID!
        name: String!
        description: String!
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
    }

    type PhotoConnection {
        cursor: String!
        photos: [Photo]!
    }

    type Query {
        photoAlbumList( 
            pageSize: Int
            after: String
            before: String
        ): PhotoAlbumConnection!
        files: [String]
    }

    input PhotoAlbumInput {
        name: String!
        description: String!
    }

    type PhotoUploadedResponse {
        filename: String!
        uploaded: Boolean!
    }

    type Mutation {
        createPhotoAlbum(input: PhotoAlbumInput): PhotoAlbum
        updatePhotoAlbum(id: ID, input: PhotoAlbumInput): PhotoAlbum
        deletePhotoAlbum(id: ID): Boolean

        uploadPhotos(files: [Upload]!): [PhotoUploadedResponse]
    }
`;

module.exports = graphQLTypes;
