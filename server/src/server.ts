require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const database = require('../models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

import PhotoAlbumAPI from './datasources/photoalbum';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        photoAlbumAPI: new PhotoAlbumAPI(database),
    })
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
