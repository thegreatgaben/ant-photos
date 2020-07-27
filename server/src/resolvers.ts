const path = require('path');
const { createWriteStream, statSync } = require('fs');

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
        uploadPhotos: async (_, { files }: UploadedFiles, { dataSources }) => {
            const { uploadPath, hostname } = dataSources.photoAPI.context;

            const handleUploadedFile = async (upload: Promise<FileUpload>) => {
                const { createReadStream, filename, mimetype } = await upload; 
                const filePath = {
                    relative: path.join(uploadPath.relative, filename),
                    absolute: path.join(uploadPath.absolute, filename),
                }
                const index = filePath.relative.indexOf('/');
                const urlPath = filePath.relative.substr(index);

                return new Promise((resolve, reject) => 
                    createReadStream()
                    .pipe(createWriteStream(filePath.absolute))
                    .on('close', () => resolve({ 
                        filename, 
                        mimetype,
                        filepath: filePath.relative,
                        filesize: statSync(filePath.absolute).size,
                        disk: 'local',
                        url: hostname + urlPath,
                    }))
                    .on('error', error => reject(error))
                );
            }

            const resultList = await Promise.allSettled(files.map(handleUploadedFile));
            resultList.forEach((result: PromiseSettledResult<any>) => console.log(result));

            return true;
        }
    },
};
