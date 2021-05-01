const { gql } = require('apollo-server');

export const graphqlTypeDefs = gql`
    type User {
        id: String!
        name: String!
        dob: String
        address: String
        description: String
        imageUrl: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        getAllUsers: [User]
    }
`;
