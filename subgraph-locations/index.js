const {ApolloServer, gql} = require('apollo-server');
const {readFileSync} = require('fs');
const {buildSubgraphSchema} = require('@apollo/subgraph');

// define gql query and resolvers from other files
const typeDefs = gql(readFileSync('./locations.graphql', {encoding: 'utf-8'}));
const resolvers = require('./resolvers');
const LocationsAPI = require('./datasources/LocationsApi');

// go
const server = new ApolloServer({
    schema: buildSubgraphSchema({typeDefs, resolvers}),
    dataSources: () => {
        return {
          locationsAPI: new LocationsAPI()
        };
      }
});

// watch
const port = 4001;
const subgraphName = 'locations';

server
  .listen({port})
  .then(({url}) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });