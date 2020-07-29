const { DataSource } = require('apollo-datasource');
import { RequestQuery } from '../../types/index.d';
import { getAllWithPagination } from '../utils';
import {QueryTypes} from 'sequelize';

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

    async delete(id) {
        const options = {
            where: { id: id }
        };
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
}

export default PhotoAlbumAPI;
