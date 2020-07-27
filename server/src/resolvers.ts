const path = require('path');
const { createWriteStream } = require('fs');

import { FileUpload } from 'graphql-upload';

interface UploadedFiles {
    files: Promise<FileUpload>[];
}

module.exports = {
    Query: {
        photoAlbumList: async (_, query, { dataSources }) => {
            const allAlbums = await dataSources.photoAlbumAPI.getAll(query);
            return allAlbums;
        },
        files: () => [],
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
        deletePhotoAlbum: async (_, { id }, { dataSources }) => {
            try {
                const result = await dataSources.photoAlbumAPI.delete(id);
                return result
            } catch (error) {
                return false;
            }
        }, 

        // Handle an array of uploaded photos asynchronously
        uploadPhotos: async (_, { files }: UploadedFiles) => {
            const handleUploadedFile = async (upload: Promise<FileUpload>) => {
                const { createReadStream, filename } = await upload; 
                return new Promise((resolve, reject) => 
                    createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "../images", filename)))
                    .on('close', () => resolve(filename))
                    .on('error', error => reject(error))
                );
            }

            const resultList = await Promise.allSettled(files.map(handleUploadedFile));
            resultList.forEach((result: PromiseSettledResult<any>) => console.log(result));

            return true;
        }
    },
};
