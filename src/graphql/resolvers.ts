import {User} from "./typedefs";
import {ApolloError, UserInputError} from 'apollo-server-errors';

const {v4: uuidv4} = require('uuid');

let users: User[] = [
    {
        "id": "ac658bae-57c6-4f13-975a-7c3146c64a49",
        "name": "backend test",
        "dob": "",
        "address": "",
        "description": "",
        "createdAt": "",
        "updatedAt": "",
        "imageUrl": ""
    }
];

export const graphqlResolvers = {
    Query: {
        getAllUsers: () => users,
    },
    Mutation: {
        createUser: (_: any, {input}: any) => {
            try {
                users.push({
                    id: uuidv4(),
                    ...input,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                return users[users.length - 1];
            } catch (e) {
                throw new ApolloError(
                    `Error creating user: ${e.message}`,
                    'SERVER_ERROR',
                    {}
                );
            }
        },

        updateUser: (_: any, {id, input}: any) => {
            try {
                const userIndex = users.findIndex((user) => user.id === id);
                if (userIndex >= 0) {
                    const currUser = users[userIndex];
                    users[userIndex] = {
                        ...input,
                        id: currUser.id,
                        createdAt: currUser.createdAt,
                        updatedAt: new Date().toISOString(),
                    };
                    return users[userIndex];
                }
                throw new ApolloError(`User: ${id} not found in database`, 'DATA_NOT_FOUND', {});
            } catch (e) {
                throw new ApolloError(
                    `Error updating user by id: ${id}: ${e.message}`,
                    'SERVER_ERROR',
                    {}
                );
            }
        },

        deleteUser: (_: any, {id}: any) => {
            try {
                const userIndex = users.findIndex((user) => user.id === id);
                if (userIndex >= 0) {
                    users = users.filter((users) => users.id !== id);
                    return {
                        result: `User with ${id} deleted`
                    };
                }
                return {
                    result: `User with ${id} not found`
                };
            } catch (e) {
                throw new ApolloError(
                    `Error deleting user by id: ${id}: ${e.message}`,
                    'SERVER_ERROR',
                    {}
                );
            }
        },
    }
};
