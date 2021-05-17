require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import path from 'path';

import database from '../models';
import schema from './gqlTypes'

import PhotoAlbumAPI from './datasources/photoalbum';
import PhotoAPI from './datasources/photo';
import UserDataSource from './datasources/user'
import {existsSync, mkdirSync} from 'fs';

const uploadPath = {
    relative: 'public/photos',
    absolute: path.join(__dirname, '../public/photos'),
}

// Create photos directory if non-existant
existsSync(uploadPath.absolute) || mkdirSync(uploadPath.absolute);

const server = new ApolloServer({
    context: ({ req }) => {
        const hostname = (req.headers && req.headers.host) || '';
        let serverBaseUrl = '';
	const protocol = process.env.HTTPS ? 'https' : req.protocol;
        if (hostname.length > 0) serverBaseUrl = `${protocol}://${hostname}`;

        // @ts-ignore
        const user = req.user || null
        return { uploadPath, serverBaseUrl, user };
    },
    dataSources: () => ({
        photoAlbumAPI: new PhotoAlbumAPI(database),
        photoAPI: new PhotoAPI(database),
        user: new UserDataSource(database)
    }),
    engine: {
        reportSchema: process.env.APOLLO_KEY ? true : false,
    },
    schema
});

export default server;
