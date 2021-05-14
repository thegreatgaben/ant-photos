import { RequestQuery } from "../../types";
import {getAllWithPagination} from "../utils";
import fs from 'fs';
import path from 'path';
import {Op as SQL} from "sequelize";
// Can't use ES6 import for this
const { DataSource } = require('apollo-datasource');

interface PhotosRequestQuery extends RequestQuery {
    albumId?: string;
    favorite?: boolean;
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
            const trueEndDate = new Date(
                endDate.getFullYear(), endDate.getMonth(), 
                endDate.getDate(), 23, 59, 59
            );
            options.where = {
                ...options.where,
                createdAt: {
                    [SQL.between]: [startDate, trueEndDate]
                }
            }
        }
        if (query.albumId) {
            options.where = {
                ...options.where,
                albumId: query.albumId,
            }
        }
        if (query.favorite) {
            options.where = {
                ...options.where,
                favorite: query.favorite
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
        if (attributes.albumId && attributes.albumId != oldPhotoAlbumId) {
            const albumPhotoCount = await photoAlbumDataSource.countPhotos(attributes.albumId);

            // Make the photo the default cover photo for the empty album its being moved to
            attributes.isCoverPhoto = albumPhotoCount == 0;

            // If the photo was a cover photo in a previous album, unset it 
            if (oldPhoto.albumId && oldPhoto.isCoverPhoto)
                isOldCoverPhoto = true;
        }
        console.log(attributes);

        await this.store.Photo.update(attributes, options);
        const result = await this.store.Photo.findOne(options);

        if (isOldCoverPhoto)
            await photoAlbumDataSource.findNewCoverPhoto(oldPhotoAlbumId, this.store.Photo);

        // Set as the cover photo for the album it moved to
        if (attributes.isCoverPhoto) 
            await photoAlbumDataSource.update(attributes.albumId, { coverPhotoUrl: result.url })

        return result;
    }

    async delete(id, photoAlbumDataSource) {
        const options = {
            where: { id: id }
        };
        const photo = await this.store.Photo.findOne(options);
        // Delete photo file
        fs.unlinkSync(path.join(__dirname, `../../${photo.filepath}`));

        const albumId = photo.albumId;
        const isCoverPhoto = photo.isCoverPhoto;
        const result = await this.store.Photo.destroy(options);

        if (albumId && isCoverPhoto)
            await photoAlbumDataSource.findNewCoverPhoto(albumId, this.store.Photo);

        return Boolean(result);
    }
}

export default PhotoAPI;
