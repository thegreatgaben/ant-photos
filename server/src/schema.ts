const { gql } = require('apollo-server');

const graphQLTypes = gql`
    type Query {
        photoAlbumList( 
            pageSize: Int
            after: String
            before: String
        ): PhotoAlbumConnection!
        files: [String]
    }

    """
    Simple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
    """
    type PhotoAlbumConnection { 
      cursor: String!
      albums: [PhotoAlbum]!
    }

    type PhotoAlbum {
        id: ID!
        name: String!
        description: String!
    }

    input PhotoAlbumInput {
        name: String!
        description: String!
    }

    type Mutation {
        createPhotoAlbum(input: PhotoAlbumInput): PhotoAlbum
        updatePhotoAlbum(id: ID, input: PhotoAlbumInput): PhotoAlbum
        deletePhotoAlbum(id: ID): Boolean
        uploadPhotos(files: [Upload]!): Boolean
    }

`;

module.exports = graphQLTypes;
