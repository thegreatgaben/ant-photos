require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import path from 'path';

const database = require('../models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

import PhotoAlbumAPI from './datasources/photoalbum';
import PhotoAPI from './datasources/photo';

const uploadPath = {
    relative: 'public/photos',
    absolute: path.join(__dirname, '../public/photos'),
}

const server = new ApolloServer({
    context: ({ req }) => {
        const hostname = (req.headers && req.headers.host) || '';
        return { uploadPath, hostname };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        photoAlbumAPI: new PhotoAlbumAPI(database),
        photoAPI: new PhotoAPI(database),
    })
});
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
server.applyMiddleware({ app });

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`);
});

