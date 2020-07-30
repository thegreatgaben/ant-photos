const path = require('path');

import { FileUpload } from 'graphql-upload';
import { PaginationResponse, UploadedFiles, PhotoMeta } from '../types/index.d';
import {handleFileUpload} from './utils';

module.exports = {
    Query: {
        photoAlbumList: async (_, query, { dataSources }) => {
            const result: PaginationResponse = await dataSources.photoAlbumAPI.getAll(query);
            return {
                cursor: result.cursor,
                albums: result.paginatedList,
            };
        },
        photoList: async (_, query, { dataSources }) => {
            const result: PaginationResponse = await dataSources.photoAPI.getAll(query);
            return {
                cursor: result.cursor,
                photos: result.paginatedList,
            };
        }
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
            try {
                const result = await dataSources.photoAlbumAPI.delete(id, deletePhotos);
                return result
            } catch (error) {
                throw Error(error);
            }
        }, 

        updatePhoto: async (_, { id, input }, { dataSources }) => {
            const photo = await dataSources.photoAPI.update(id, input, dataSources.photoAlbumAPI);
            return photo;
        },
        deletePhoto: async (_, { id }, { dataSources }) => {
            try {
                const result = await dataSources.photoAPI.delete(id, dataSources.photoAlbumAPI);
                return result
            } catch (error) {
                throw Error(error);
            }
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
    },
};
