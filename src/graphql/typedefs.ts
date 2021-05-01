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
        updateUser(id: String!, input: UserCreateInput): User
        deleteUser(id: String!): DeleteResult
    }
    
    type DeleteResult {
        result: String        
    }
`;


export interface User {
    id: string,
    name: string,
    dob: string | null | undefined,
    address: string | null | undefined,
    description: string | null | undefined,
    imageUrl: string | null | undefined,
    createdAt: string | null | undefined,
    updatedAt: string | null | undefined
}


import { ApolloError } from 'apollo-server-errors';

export class AppError extends ApolloError {
  constructor(message: string, code: string) {
    super(message, code);

    Object.defineProperty(this, 'name', { value: 'AppError' });
  }
}
