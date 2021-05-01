const { ApolloServer, gql } = require('apollo-server');
const { graphqlTypeDefs} = require('./graphql/typedefs');
const { graphqlResolvers } = require('./graphql/resolvers');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs: graphqlTypeDefs, resolvers: graphqlResolvers });

// The `listen` method launches a web server.
// @ts-ignore
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
