import AWS from "aws-sdk";
const { DynamoDB } = AWS;

const AWS_REGION = process.env.AWS_REGION || "eu-west-2"; // Change to your region if necessary
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const docClient = new DynamoDB.DocumentClient({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export { docClient };
