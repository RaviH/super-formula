const { v4: uuidv4 } = require('uuid');

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
    Mutation: {
        createUser: (_: any, {input} : any) => {
            console.log(`${JSON.stringify(input)}`);
            users.push({
                id: uuidv4(),
                ...input,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            return users[users.length - 1];
        },
    }
};
