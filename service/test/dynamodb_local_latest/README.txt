super-formula-interview
------

1. Run functional tests: `yarn test`
2. Run integration tests: `yarn integrationtest`

Design/Architectural decisions:

1. Functional Test: Test the CRUD functionality against local DynamoDB and Apollo Server
2. Integration Test: Test the CRUD functionality against local SAM deployment of
   lambda and real AWS DynamoDB.
