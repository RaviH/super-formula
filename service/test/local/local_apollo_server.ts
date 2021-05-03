const { ApolloServer } = require('apollo-server');
const { graphqlTypeDefs} = require('../../src/graphql/typedefs');
const { graphqlResolvers } = require('../../src/graphql/resolvers');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
export const server = new ApolloServer({ typeDefs: graphqlTypeDefs, resolvers: graphqlResolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
