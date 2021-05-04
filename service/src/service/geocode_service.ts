import {ApolloError} from "apollo-server-errors";
import {UserInputError} from "apollo-server-lambda";
import axios from 'axios';

const accessToken = 'pk.eyJ1IjoicmF2aW1lZXRzdSIsImEiOiJja284dWg0dGMyNjJqMnFtYnB4a3hvMmFwIn0.ru5bOYjQBLV7nOMmWYPXjg';

function getUrl(address: string) {
    return 'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + accessToken;
}

export interface GetCoordinatesResponse {
    coordinates: string[]
}

/**
 * Get coordinates for the address string.
 *
 * @param {string} address
 * @returns {GetCoordinatesResponse} coordinates for the given address.
 */
export const getCoordinatesForAddress = async (
    address: string
) : Promise<GetCoordinatesResponse> => {
    try {
        const axiosResponse = await axios.get(getUrl(address));
        const result = axiosResponse.data;
        if (result.features && result.features.length > 0) {
            const geometry = result.features[0].geometry;
            if (geometry && geometry.coordinates) {
                return {
                    coordinates: geometry.coordinates
                };
            }
        }
        throw new UserInputError(
            `Could not find coordinates for address: ${address}. Please try with a valid address.`
        );
    } catch (e) {
        throw new ApolloError(
            `Error getting coordinates for address: ${address}`,
            'SERVER_ERROR',
            {}
        );
    }
}
