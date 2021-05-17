import { gql } from 'apollo-server-express'
import { PaginationResponse, UploadedFiles, PhotoMeta } from '../../types/index.d'
import { handleFileUpload } from '../utils'
import { isAuthenticated } from '../auth/rules'

export const typeDef = gql`
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

    extend type Query {
        photoList(
            pageSize: Int
            after: String
            albumId: ID
            startDate: String
            endDate: String
            favorite: Boolean
        ): PhotoConnection!
    }

    input PhotoInput {
        caption: String
        albumId: ID
        favorite: Boolean
    }

    type PhotoUploadedResponse {
        filename: String!
        uploaded: Boolean!
    }

    extend type Mutation {
        uploadPhotos(files: [Upload]!, albumId: ID): [PhotoUploadedResponse]
        updatePhoto(id: ID!, input: PhotoInput!): Photo
        deletePhoto(id: ID): Boolean
    }
`

export const permissions = {
    Query: {
        photoList: isAuthenticated
    },
    Mutation: {
        updatePhoto: isAuthenticated,
        deletePhoto: isAuthenticated,
        uploadPhotos: isAuthenticated
    }
}

export const resolvers = {
    Query: {
        photoList: async (_, query, { dataSources }) => {
            const result: PaginationResponse = await dataSources.photoAPI.getAll(query);
            return {
                cursor: result.cursor,
                photos: result.paginatedList,
            };
        }
    },
    Mutation: {
        updatePhoto: async (_, { id, input }, { dataSources }) => {
            const photo = await dataSources.photoAPI.update(id, input, dataSources.photoAlbumAPI);
            return photo;
        },
        deletePhoto: async (_, { id }, { dataSources }) => {
            const result = await dataSources.photoAPI.delete(id, dataSources.photoAlbumAPI);
            return result
        },

        // Handle an array of uploaded photos asynchronously
        uploadPhotos: async (_, { files, albumId }: UploadedFiles, { dataSources }) => {

            const resultList = await Promise.allSettled(
                files.map(upload => handleFileUpload(upload, dataSources.photoAPI.context, albumId))
            );

            let response = [];
            const succeeded = resultList.reduce((filtered, result: PromiseSettledResult<PhotoMeta>) => {
                if (result.status === 'fulfilled') {
                    filtered.push(result.value.fileStats);
                    response.push({ filename: result.value.origFilename, uploaded: true })
                } else {
                    response.push({ filename: result.reason.message, uploaded: false })
                }
                return filtered;
            }, []);

            // Make the first photo uploaded to be the default album cover photo
            let hasCoverPhoto = false;
            if (albumId) {
                const albumPhotoCount = await dataSources.photoAlbumAPI.countPhotos(albumId);
                if (albumPhotoCount == 0) {
                    succeeded[0].isCoverPhoto = true;
                }
                hasCoverPhoto = true;
            }

            const photoList = await dataSources.photoAPI.createMany(succeeded);

            if (hasCoverPhoto) {
                await dataSources.photoAlbumAPI.update(albumId, { coverPhotoUrl: photoList[0].url });
            }

            return response;
        }
    }
}
