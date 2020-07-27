require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import path from 'path';

const database = require('../models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

import PhotoAlbumAPI from './datasources/photoalbum';
import PhotoAPI from './datasources/photo';

const uploadPath = path.join(__dirname, '../public/photos');

const server = new ApolloServer({
    context: () => ({ uploadPath }),
    typeDefs,
    resolvers,
    dataSources: () => ({
        photoAlbumAPI: new PhotoAlbumAPI(database),
        photoAPI: new PhotoAPI(database),
    })
});
const app = express();
app.use('/photos', express.static(uploadPath));
server.applyMiddleware({ app });

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`);
});

