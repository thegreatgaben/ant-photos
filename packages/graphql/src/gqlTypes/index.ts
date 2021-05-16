import { gql, GraphQLUpload } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'
import { typeDef as Photo, resolvers as photoResolvers } from './photos'
import { typeDef as PhotoAlbum, resolvers as photoAlbumResolvers } from './photoAlbum'

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

export default makeExecutableSchema({
    typeDefs: [typeDef, Photo, PhotoAlbum],
    resolvers: merge(resolvers, photoResolvers, photoAlbumResolvers)
})
