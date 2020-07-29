import { RequestQuery } from "../../types";
import {getAllWithPagination} from "../utils";
import fs from 'fs';
import path from 'path';
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
        if (query.albumId) {
            options.where = {
                albumId: query.albumId,
            }
        }
        const results = await getAllWithPagination(this.store.Photo, options, query);
        return results;
    }

    async update(id, attributes) {
        const options = {
            where: { id: id }
        };
        await this.store.Photo.update(attributes, options);
        const result = await this.store.Photo.findOne(options);
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
