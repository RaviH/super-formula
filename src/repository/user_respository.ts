import {DeleteItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {User} from "../graphql/typedefs";

const {DynamoDBClient, GetItemCommand} = require("@aws-sdk/client-dynamodb");
const {v4: uuidv4} = require('uuid');

// Create DynamoDB service object
const dbClient = new DynamoDBClient({region: "us-west-2"});
const USERS_TABLE = "usersTable";

export const getUserByUserId = async (
    userId: string = '534e653b-865e-47b4-bfde-1be69cf80abb'
) => {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            id: {S: userId},
        },
        ProjectionExpression: "id, userName, dob, address, description, imageUrl, createdAt, updatedAt",
    };


    const data = await dbClient.send(new GetItemCommand(params));
    return {
        id: userId,
        name: data.Item.userName.S,
        dob: data.Item.dob.S,
        address: data.Item.address.S,
        description: data.Item.description.S,
        imageUrl: data.Item.imageUrl.S,
        createdAt: data.Item.createdAt.S,
        updatedAt: data.Item.updatedAt.S,
    }
};

export const getUsers = async () => {
    const params = {
        TableName: USERS_TABLE,
        ProjectionExpression: "id, userName, dob, address, description, imageUrl, createdAt, updatedAt",
    };


    const data = await dbClient.send(new ScanCommand(params));
    return data.Items.map((item) => ({
        id: item.id.S,
        name: item.userName.S,
        dob: item.dob.S,
        address: item.address.S,
        description: item.description.S,
        imageUrl: item.imageUrl.S,
        createdAt: item.createdAt.S,
        updatedAt: item.updatedAt.S,
    }));
};

export const createUser = async (user: User) => {
    const currDate = new Date().toISOString();
    user.id = uuidv4();
    user.createdAt = currDate;
    user.updatedAt = currDate;
    const params = {
        Item: {
            "id": {
                S: user.id
            },
            "userName": {
                S: user.name
            },
            "description": {
                S: user?.description ?? ''
            },
            "dob": {
                S: user?.dob ?? ''
            },
            "address": {
                S: user?.address ?? ''
            },
            "imageUrl": {
                S: user?.imageUrl ?? ''
            },
            "createdAt": {
                S: user.createdAt
            },
            "updatedAt": {
                S: user.updatedAt
            },
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: USERS_TABLE,
    };

    await dbClient.send(new PutItemCommand(params));
    return getUserByUserId(user.id);
};

export const updateUser = async (id: string, user: User) => {
    const params = {
        ExpressionAttributeNames: {
            "#name": "name",
            "#dob": "dob",
            "#address": "address",
            "#description": "description",
            "#imageUrl": "imageUrl",
            "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
            ":name": {
                S: user.name
            },
            ":dob": {
                S: user.dob ?? ''
            },
            ":address": {
                S: user.address ?? ''
            },
            ":description": {
                S: user.description ?? ''
            },
            ":imageUrl": {
                S: user.imageUrl ?? ''
            },
            ":updatedAt": {
                S: user.updatedAt ?? ''
            },
        },
        Key: {
            "id": {
                S: id
            },
        },
        ReturnValues: "ALL_NEW",
        TableName: USERS_TABLE,
        UpdateExpression: `SET 
            #name = :name, 
            #dob = :dob, 
            #address = :address,
            #description = :description,
            #imageUrl = :imageUrl,
            #updatedAt = :updatedAt`
    };

    user.updatedAt = new Date().toISOString();
    await dbClient.send(new UpdateItemCommand(params));
    return getUserByUserId(id);
};

export const deleteUser = async (id: string) => {
    const params = {
        Key: {
            "id": {
                S: id
            },
        },
        TableName: USERS_TABLE,
        ReturnValues: 'ALL_OLD'
    };

    const deleteItemCommandOutput = await dbClient.send(new DeleteItemCommand(params));
    return deleteItemCommandOutput.Attributes
        ? { result: `Successfully deleted user: ${id}`}
        : { result: `User with id: ${id} not found`};
};
