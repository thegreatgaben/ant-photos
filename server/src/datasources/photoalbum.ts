const { DataSource } = require('apollo-datasource');
const { Op: SQL } = require('sequelize'); 
import { RequestQuery } from '../../types/index.d';

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
            attributes: ['id', 'name', 'description'],
            order: [
                ['id', 'ASC']  
            ],
        }
        // TODO: Validate pagination params
        let { pageSize, after } = query;
        if (!pageSize) pageSize = 20;

        // An additional result to get the 'next' cursor
        options.limit = pageSize + 1;
        if (after) {
            options.where = {id: {[SQL.gte]: after} }
        }

        const albumList: Array<any> = await this.store.PhotoAlbum.findAll(options)

        // Last page
        if (albumList.length <= pageSize) {
            return {
                cursor: '',
                albums: albumList,
            }
        } else {
            const results = albumList.slice(0, albumList.length-1);
            return {
                cursor: albumList[albumList.length-1].id,
                albums: results,
            }
        }
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
}

export default PhotoAlbumAPI;
