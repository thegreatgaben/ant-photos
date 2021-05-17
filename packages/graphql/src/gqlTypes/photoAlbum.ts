import { gql } from 'apollo-server-express';
import { PaginationResponse } from '../../types/index.d'
import { isAuthenticated } from '../auth/rules'

export const typeDef = gql`
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

    extend type Query {
        photoAlbumList( 
            pageSize: Int
            after: String
            search: String
        ): PhotoAlbumConnection!
    }

    input PhotoAlbumInput {
        name: String!
        description: String!
    }

    extend type Mutation {
        createPhotoAlbum(input: PhotoAlbumInput!): PhotoAlbum
        updatePhotoAlbum(id: ID!, input: PhotoAlbumInput!): PhotoAlbum
        deletePhotoAlbum(id: ID!, deletePhotos: Boolean): Boolean
    }
`

export const permissions = {
    Query: {
        photoAlbumList: isAuthenticated
    },
    Mutation: {
        createPhotoAlbum: isAuthenticated,
        updatePhotoAlbum: isAuthenticated,
        deletePhotoAlbum: isAuthenticated
    }
}

export const resolvers = {
    Query: {
        photoAlbumList: async (_, query, { dataSources }) => {
            const result: PaginationResponse = await dataSources.photoAlbumAPI.getAll(query);
            return {
                cursor: result.cursor,
                albums: result.paginatedList,
            };
        },
    },
    Mutation: {
        createPhotoAlbum: async (_, { input }, { dataSources }) => {
            const photoAlbum = await dataSources.photoAlbumAPI.create(input);
            return {
                id: photoAlbum.id,
                name: photoAlbum.name,
                description: photoAlbum.description,
            }
        },
        updatePhotoAlbum: async (_, { id, input }, { dataSources }) => {
            const photoAlbum = await dataSources.photoAlbumAPI.update(id, input);
            return {
                id: photoAlbum.id,
                name: photoAlbum.name,
                description: photoAlbum.description,
            }
        },
        deletePhotoAlbum: async (_, { id, deletePhotos }, { dataSources }) => {
            const result = await dataSources.photoAlbumAPI.delete(id, deletePhotos);
            return result
        }, 
    }
}
