'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hello = async event => {
  try {
    // Extract discordID from the event path parameters
    const discordID = event.pathParameters.discordID;
    
    // Query DynamoDB to fetch the character names for the given discordID
    const params = {
      TableName: 'shismo-manager',
      KeyConditionExpression: '#discordID = :discordID',
      ExpressionAttributeNames: {
        '#discordID': 'discordID',  // Partition key
      },
      ExpressionAttributeValues: {
        ':discordID': discordID,  // discordID from the event
      },
    };
    
    // Perform the query to DynamoDB
    const data = await dynamoDb.query(params).promise();
    
    // Check if we found any items
    if (data.Items && data.Items.length > 0) {
      const characterNames = data.Items.map(item => item.characterName);
      
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: 'Character names fetched successfully',
            characterNames: characterNames,
          },
          null,
          2
        ),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message: 'No character names found for the given Discord ID',
          },
          null,
          2
        ),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Error fetching character names',
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
