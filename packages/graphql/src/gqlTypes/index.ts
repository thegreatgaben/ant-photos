import { gql, GraphQLUpload } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { merge } from 'lodash'
import { typeDef as Photo, resolvers as photoResolvers } from './photo'
import { typeDef as PhotoAlbum, resolvers as photoAlbumResolvers } from './photoAlbum'
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

export default makeExecutableSchema({
    typeDefs: [typeDef, Photo, PhotoAlbum, User],
    resolvers: merge(resolvers, photoResolvers, photoAlbumResolvers, userResolvers)
})
