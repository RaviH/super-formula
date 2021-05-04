import {User} from "./schema";
import {ApolloError} from 'apollo-server-errors';
import {createUser, deleteUser, getUserByUserId, getUsers, updateUser} from "../repository/user_respository";
import {getCoordinatesForAddress, GetCoordinatesResponse} from "../service/geocode_service";

export const graphqlResolvers = {
    Query: {
        getAllUsers: async () : Promise<User[]> => {
            return await getUsers();
        },
        getUserByUserId: async (_: any, {id}: {id: string}) : Promise<User> => {
            return await getUserByUserId(id);
        },
        getGeoCode: async (
            _: never,
            {address}: {address: string}
        ): Promise<GetCoordinatesResponse> => {
            return await getCoordinatesForAddress(address)
        },
    },
    Mutation: {
        createUser: async (_: any, {input}: {input: User}) : Promise<User> => {
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

        updateUser: async (_: any, {id, input}: {id: string, input: User}) : Promise<User> => {
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

        deleteUser: async (_: any, {id}: {id: string}) : Promise<{result: string}> => {
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
