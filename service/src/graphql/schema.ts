const { gql } = require('apollo-server-lambda');

export const graphqlTypeDefs = gql`
    """
    User object to be saved to DB
    """
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

    """
    Input object for creating a user.
    """
    input UserCreateInput {
        name: String!
        dob: String
        address: String
        description: String
        imageUrl: String
    }

    """
    Coordinates to be returned to the user via API
    """
    type Coordinates {
        coordinates: [String]
    }

    """
    Queries available via the API
    """
    type Query {
        getGeoCode(address: String!): Coordinates
        getAllUsers: [User]
        getUserByUserId(id: String!): User
    }

    """
    Mutations available via the API
    """
    type Mutation {
        """
        Create user and return newly created user.
        """
        createUser(input: UserCreateInput): User
        """
        Update user and return updated user.
        """
        updateUser(id: String!, input: UserCreateInput): User
        """
        Delete user and return result of operation.
        """
        deleteUser(id: String!): DeleteResult
    }
    
    type DeleteResult {
        result: String        
    }
`;

export interface User {
    id: string,
    name: string,
    dob?: string,
    address?: string,
    description?: string,
    imageUrl?: string,
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
