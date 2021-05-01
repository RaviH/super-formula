import {expect} from 'chai';
const chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));

const url = `http://localhost:4000/`;
const request = require('supertest')(url);
const {graphqlTypeDefs} = require('../src/graphql/typedefs');

let createdUserId = '';

describe('GraphQL', () => {
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
                query: `mutation UpdateUser {  updateUser(    id: \"${createdUserId}\"    input: {name: \"Backend test\", dob: \"07/07/1929\"}  ) { id name dob address description imageUrl }}`
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
                    dob: "07/07/1929",
                    address: "USA",
                    description: "USA user",
                    imageUrl: "https://google.com"
                })
                expect(user.id).to.not.be.null;
                done();
            });
    })

    it('when deleting a NON existing user, then that user is returned', () => {
        expect(graphqlTypeDefs).to.not.eq(null);
        request.post('/')
            .send({
                query: `mutation DeleteUser { deleteUser(id: "${createdUserId}-99") { result }}`
            })
            .expect(200)
            .end((err, res) => {
                const data = res.body.data;
                expect(data).to.not.be.null;
                expect(data.deleteUser).to.deep.eq({
                    result: "c68b63ae-60c7-4864-ac09-985640b8b6771 not found"
                })
            });
    });

    it('when deleting an existing user, then that user is returned', () => {
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
                    result: "c68b63ae-60c7-4864-ac09-985640b8b6771 not found"
                })
            });
    });
});
