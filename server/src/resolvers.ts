const path = require('path');
const { createWriteStream, statSync } = require('fs');
import crypto from 'crypto';

import { FileUpload } from 'graphql-upload';
import { PaginationResponse } from '../types/index.d';

interface UploadedFiles {
    files: Promise<FileUpload>[];
}

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
            const { uploadPath, serverBaseUrl } = dataSources.photoAPI.context;

            const handleUploadedFile = async (upload: Promise<FileUpload>) => {
                const { createReadStream, filename, mimetype } = await upload; 

                const origFilename = filename;
                const fileExt = origFilename.split('.')[1];
                const newFilename = `${crypto.randomBytes(20).toString('hex')}.${fileExt}`;

                const filePath = {
                    relative: path.join(uploadPath.relative, newFilename),
                    absolute: path.join(uploadPath.absolute, newFilename),
                }
                const index = filePath.relative.indexOf('/');
                const urlPath = filePath.relative.substr(index);

                return new Promise((resolve, reject) => 
                    createReadStream()
                    .pipe(createWriteStream(filePath.absolute))
                    .on('close', () => resolve({ 
                        origFilename: origFilename,
                        fileStats: {
                            mimetype,
                            filename: newFilename, 
                            filepath: filePath.relative,
                            filesize: statSync(filePath.absolute).size,
                            disk: 'local',
                            url: serverBaseUrl + urlPath,
                        }
                    }))
                    .on('error', error => reject(error))
                );
            }

            const resultList = await Promise.allSettled(files.map(handleUploadedFile));

            let response = [];
            // @ts-ignore
            const succeeded = resultList.reduce((filtered, result) => {
                if (result.status === 'fulfilled') {
                    // @ts-ignore
                    filtered.push(result.value.fileStats);
                    // @ts-ignore
                    response.push({ filename: result.value.origFilename, uploaded: true })
                } else {
                    // @ts-ignore
                    response.push({ filename: result.value.origFilename, uploaded: false })
                }
                return filtered;
            }, []);
            await dataSources.photoAPI.createMany(succeeded);

            return response;
        }
    },
};
