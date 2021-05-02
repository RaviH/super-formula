import {User} from "./typedefs";
import {ApolloError} from 'apollo-server-errors';
import {createUser, deleteUser, getUserByUserId, getUsers, updateUser} from "../repository/user_respository";

const {v4: uuidv4} = require('uuid');

let users: User[] = [];

export const graphqlResolvers = {
    Query: {
        getAllUsers: async () => {
            return await getUsers();
        },
        getUserByUserId: async (_: any, {id}: any) => {
            return await getUserByUserId(id);
        }
    },
    Mutation: {
        createUser: async (_: any, {input}: any) => {
            try {
                return await createUser({
                    ...input
                });
            } catch (e) {
                throw new ApolloError(
                    `Error creating user: ${e.message}`,
                    'SERVER_ERROR',
                    {}
                );
            }
        },

        updateUser: async (_: any, {id, input}: any) => {
            try {
                return await updateUser(id, input);
            } catch (e) {
                throw new ApolloError(
                    `Error updating user by id: ${id}: ${e.message}`,
                    'SERVER_ERROR',
                    {}
                );
            }
        },

        deleteUser: async (_: any, {id}: any) => {
            try {
                return  await deleteUser(id);
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
