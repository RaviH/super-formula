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
    
    input UserCreateInput {
        name: String!
        dob: String
        address: String
        description: String
        imageUrl: String
    }

    type Query {
        getAllUsers: [User]
    }

    type Mutation {
        createUser(input: UserCreateInput): User
    }
`;
