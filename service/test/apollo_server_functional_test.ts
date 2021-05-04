process.env.TEST_MODE = 'true';

import {start, stop} from "./local/local_apollo_server";
import {expect} from 'chai';
const chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));

const url = `http://localhost:4000/`;
const request = require('supertest')(url);
const {graphqlTypeDefs} = require('../src/graphql/typedefs');
import {deleteUserTable, createUserTable}  from '../src/repository/user_respository';

let createdUserId = '';

describe('GraphQL', () => {
    before(async () => {
        await deleteUserTable();
        await createUserTable();
        start();
    });

    after( () => {
        stop();
    })

    it('when there are users then get all users returns empty users', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: "{  getAllUsers { id name dob address description imageUrl }}"
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const data = res.body.data;
                expect(data).to.not.be.null;
                const allUsers = data.getAllUsers;
                expect(allUsers).to.deep.eq([]);
                done();
            })
    });

    it('when we create a new user, then that user is returned', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: 'mutation { createUser ' +
                    '(input: {name: "hope is a good thing", dob: "07/08/1999", address: "USA", description: "USA user", imageUrl: "https://google.com" }) ' +
                    '{ id name dob address description imageUrl }}'
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.not.be.null;
                const newUser = data.createUser;
                expect(newUser).to.not.be.null;
                expect(newUser).to.shallowDeepEqual({
                    name: "hope is a good thing",
                    dob: "07/08/1999",
                    address: "USA",
                    description: "USA user",
                    imageUrl: "https://google.com"
                });
                expect(newUser.id).to.not.be.null;
                expect(newUser.createdAt).to.not.be.null;
                expect(newUser.updatedAt).to.not.be.null;
                createdUserId = newUser.id;
                done();
            });
    });

    it('when we get user by id, then that user is returned', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: `{  getUserByUserId(id: "${createdUserId}") { id name dob address description imageUrl createdAt updatedAt }}`
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.be.ok;
                const user = data.getUserByUserId;
                expect(user).to.be.ok;
                expect(user).to.shallowDeepEqual({
                    name: "hope is a good thing",
                    dob: "07/08/1999",
                    address: "USA",
                    description: "USA user",
                    imageUrl: "https://google.com"
                });
                expect(user.id).to.not.be.null;
                expect(user.createdAt).to.not.be.null;
                expect(user.updatedAt).to.not.be.null;
                createdUserId = user.id;
                done();
            });
    });

    it('get geo code with existing address', (done) => {
        request.post('/')
            .send({
                query: `{  getGeoCode(address: "Portland, OR") { coordinates }}`
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.be.ok;
                const geoCode = data.getGeoCode;
                expect(geoCode).to.be.ok;
                expect(geoCode.coordinates).to.deep.eql(["-122.6742", "45.5202"]);
                done();
            });
    });

    it('when there are users then get all users returns all the users', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: "{  getAllUsers { id name dob address description imageUrl }}"
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const data = res.body.data;
                expect(data).to.not.be.null;
                const allUsers = data.getAllUsers;
                const user = allUsers[allUsers.length - 1];
                expect(allUsers).to.not.be.null;
                expect(user).to.deep.eq({
                    id: createdUserId,
                    name: "hope is a good thing",
                    dob: "07/08/1999",
                    address: "USA",
                    description: "USA user",
                    imageUrl: "https://google.com"
                });
                expect(user.createdAt).to.not.be.null;
                expect(user.updatedAt).to.not.be.null;
                done();
            })
    });

    it('when we update an existing user, then that user is returned', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: `mutation UpdateUser {  updateUser(    id: "${createdUserId}"    input: {name: "Backend test", dob: "07/07/2020", address: "India", description: "India user", imageUrl: "https://google.in"}  ) { id name dob address description imageUrl }}`
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.not.be.null;
                const user = data.updateUser;
                expect(user).to.not.be.undefined;
                expect(user).to.deep.include({
                    id: createdUserId,
                    name: "Backend test",
                    dob: "07/07/2020",
                    address: "India",
                    description: "India user",
                    imageUrl: "https://google.in"
                })
                expect(user.id).to.not.be.null;
                done();
            });
    })

    it('when deleting a NON existing user, then that user is returned', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        const nonExistingId = `${createdUserId}-99`
        request.post('/')
            .send({
                query: `mutation DeleteUser { deleteUser(id: "${nonExistingId}") { result }}`
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.not.be.null;
                expect(data.deleteUser).to.deep.equal({
                    result: `User with id: ${nonExistingId} not found`
                });
                done();
            });
    });

    it('when deleting an existing user, then that user is returned', (done) => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: `mutation DeleteUser {  deleteUser(id: "${createdUserId}") {    result  }}`
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.not.be.null;
                expect(data.deleteUser).to.deep.eq({
                    result: `Successfully deleted user: ${createdUserId}`
                });
                done();
            });
    });
});
