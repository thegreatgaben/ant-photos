const { DataSource } = require('apollo-datasource');
import { RequestQuery } from '../../types/index.d';
import { getAllWithPagination } from '../utils';
import {QueryTypes, Op as SQL, Model} from 'sequelize';
import fs from 'fs';
import path from 'path';

class PhotoAlbumAPI extends DataSource {
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

    async create(attributes) {
        const result = await this.store.PhotoAlbum.create(attributes);
        return result;
    }

    async getAll(query: RequestQuery) {
        let options: {[key: string]: any} = {
            attributes: ['id', 'name', 'description', 'coverPhotoUrl'],
            order: [
                ['id', 'DESC']  
            ],
        }
        if (query.search) {
            options.where = {
                name: {
                    [SQL.iLike]: `%${query.search}%`,
                }
            }
        }
        const results = await getAllWithPagination(this.store.PhotoAlbum, options, query);
        return results;
    }

    async update(id, attributes) {
        const options = {
            where: { id: id }
        };
        await this.store.PhotoAlbum.update(attributes, options);
        const result = await this.store.PhotoAlbum.findOne(options);
        return result;
    }

    async delete(id, deletePhotos = false) {
        const options = {
            where: { id: id },
            include: this.store.Photo
        };
        const album = await this.store.PhotoAlbum.findOne(options);
        // TODO: Quite inefficient
        for (let i = 0; i < album.Photos.length; i++) {
            const photo = album.Photos[i];
            if (deletePhotos) {
                // Delete photo file
                fs.unlinkSync(path.join(__dirname, `../../${photo.filepath}`));
                await photo.destroy();
            }
            else {
                photo.albumId = null;
                photo.isCoverPhoto = false;
                await photo.save();
            }
        }

        const result = await this.store.PhotoAlbum.destroy(options);

        return Boolean(result);
    }

    async countPhotos(id) {
        const [result] = await this.store.sequelize.query('SELECT COUNT(*) FROM "Photos" where "albumId" = ?', {
            replacements: [id],
            type: QueryTypes.SELECT,
        })
        return result.count;
    }

    // Will find the next new cover photo when its current one has been deleted or moved to another album
    // It just gets the latest photo in the album
    // If no more photos in the album, then a placeholder would be used
    async findNewCoverPhoto(id, photoModel) {
        let options: {[key: string]: any} = {
            where: {
                albumId: id
            },
            order: [
                ['id', 'DESC']  
            ],
            limit: 1,
        }
        const photoList: any[] = await photoModel.findAll(options);
        if (photoList.length > 0) {
            photoList[0].isCoverPhoto = true;
            await photoList[0].save();
        }

        options = { where: { id } };
        const album = await this.store.PhotoAlbum.findOne(options);
        album.coverPhotoUrl = photoList.length > 0 ? photoList[0].url : null;
        await album.save();
    }
}

export default PhotoAlbumAPI;
