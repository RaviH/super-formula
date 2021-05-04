const { ApolloServer } = require('apollo-server-lambda');
const { graphqlTypeDefs} = require('./graphql/schema');
const { graphqlResolvers } = require('./graphql/resolvers');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
export const server = new ApolloServer({ typeDefs: graphqlTypeDefs, resolvers: graphqlResolvers });

exports.handler = server.createHandler();
