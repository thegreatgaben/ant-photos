import { gql, GraphQLUpload } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { merge } from 'lodash'
import { shield } from 'graphql-shield'
import { applyMiddleware } from 'graphql-middleware'
import { typeDef as Photo, permissions as photoPermissions, resolvers as photoResolvers } from './photo'
import { typeDef as PhotoAlbum, permissions as photoAlbumPermissions, resolvers as photoAlbumResolvers } from './photoAlbum'
import { typeDef as User, resolvers as userResolvers } from './user'

const typeDef = gql`
    scalar Upload

    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`

const resolvers = {
    Upload: GraphQLUpload
}

const authMiddleware = shield(merge(photoPermissions, photoAlbumPermissions))

export default applyMiddleware(
    makeExecutableSchema({
        typeDefs: [typeDef, Photo, PhotoAlbum, User],
        resolvers: merge(resolvers, photoResolvers, photoAlbumResolvers, userResolvers)
    }),
    authMiddleware
)
