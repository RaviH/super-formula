const users = [
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
};
