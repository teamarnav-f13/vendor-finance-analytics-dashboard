All backend APIs extract vendor_id from the Cognito JWT token. No API accepts vendor_id from request body or query parameters. DynamoDB queries are always scoped using the vendor_id from the token.
