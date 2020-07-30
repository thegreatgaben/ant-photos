import { RequestQuery } from "../../types";
import {getAllWithPagination} from "../utils";
import fs from 'fs';
import path from 'path';
import {Op as SQL} from "sequelize";
const { DataSource } = require('apollo-datasource');

interface PhotosRequestQuery extends RequestQuery {
    albumId?: string;
}

class PhotoAPI extends DataSource {
    constructor(store) {
        super();
        this.store = store;
    }

    /**
     * This is a function that gets called by ApolloServer when being setup.
     * This function gets called with the datasource config including things
     * like caches and context. We'll assign this.context to the request context
     * here, so we can know about the user making requests
     */
    initialize(config) {
        this.context = config.context;
    }

    async createMany(fileStatsList) {
        const photoList = await this.store.Photo.bulkCreate(fileStatsList);
        return photoList;
    }

    async getAll(query: PhotosRequestQuery) {
        let options: {[key: string]: any} = {
            order: [
                ['id', 'DESC']  
            ],
        }
        if (query.startDate && query.endDate) {
            const startDate = new Date(query.startDate);
            const endDate = new Date(query.endDate);
            options.where = {
                createdAt: {
                    [SQL.between]: [startDate, endDate]
                }
            }
        }
        if (query.albumId) {
            options.where = {
                albumId: query.albumId,
            }
        }
        let results = null;
        if (query.pageSize) {
            results = await getAllWithPagination(this.store.Photo, options, query);
        } else {
            results = {
                cursor: '',
                paginatedList: await this.store.Photo.findAll(options),
            }
        }
        return results;
    }

    async update(id, attributes, photoAlbumDataSource) {
        const options = {
            where: { id: id }
        };
        
        const oldPhoto = await this.store.Photo.findOne(options);

        let isOldCoverPhoto = false;
        const oldPhotoAlbumId = oldPhoto.albumId;
        if (attributes.albumId) {
            const albumPhotoCount = await photoAlbumDataSource.countPhotos(attributes.albumId);

            // Make the photo the default cover photo for the empty album its being moved to
            if (albumPhotoCount == 0) 
                attributes.isCoverPhoto = true;

            // If moving to a non-empty album AND the photo was a cover photo in a previous album, unset it 
            else if (oldPhoto.albumId && oldPhoto.isCoverPhoto) {
                isOldCoverPhoto = true;
                attributes.isCoverPhoto = false;
            }
        }

        await this.store.Photo.update(attributes, options);
        const result = await this.store.Photo.findOne(options);

        if (isOldCoverPhoto)
            await photoAlbumDataSource.findNewCoverPhoto(oldPhotoAlbumId, this.store.Photo);

        // Set as the cover photo for the album it moved to
        if (attributes.isCoverPhoto) 
            await photoAlbumDataSource.update(attributes.albumId, { coverPhotoUrl: result.url })

        return result;
    }

    async delete(id) {
        const options = {
            where: { id: id }
        };
        const photo = await this.store.Photo.findOne(options);
        // Delete photo file
        fs.unlinkSync(path.join(__dirname, `../../${photo.filepath}`));

        const result = await this.store.Photo.destroy(options);
        return Boolean(result);
    }
}

export default PhotoAPI;
