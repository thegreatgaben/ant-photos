require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import path from 'path';

import database from '../models';
import typeDefs from './schema';
import resolvers from './resolvers';

import PhotoAlbumAPI from './datasources/photoalbum';
import PhotoAPI from './datasources/photo';
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
        if (hostname.length > 0) serverBaseUrl = `${req.protocol}://${hostname}`;
        return { uploadPath, serverBaseUrl };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        photoAlbumAPI: new PhotoAlbumAPI(database),
        photoAPI: new PhotoAPI(database),
    }),
    engine: {
        reportSchema: process.env.APOLLO_KEY ? true : false,
    },
});
const app = express();
app.use('/photos', express.static(uploadPath.absolute));
server.applyMiddleware({ app });

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`);
});

