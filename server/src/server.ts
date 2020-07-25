require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const { sequelize } = require('../models');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const UserAPI = require('./datasources/user');

console.log(sequelize);
/*
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        userAPI: new UserAPI({ store }),
    })
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
*/
