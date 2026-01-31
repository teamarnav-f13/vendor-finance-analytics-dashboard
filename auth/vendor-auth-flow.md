Vendors authenticate using Amazon Cognito User Pool. Upon successful login, Cognito issues a JWT token containing the sub claim, which uniquely identifies the vendor.

All backend APIs are protected using a Cognito authorizer in API Gateway. Lambda functions extract the vendor identifier from the JWT token (sub) and use it as the partition key in DynamoDB queries.

Vendor identifiers are never accepted from client requests, ensuring strict data isolation and preventing unauthorized access.
