"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getCharacters = async (event) => {
  try {
    const discordID = event.pathParameters.discordID;

    // First get all connectionIDs associated with discordID
    const params = {
      TableName: "shismo-websocket-connections",
      KeyConditionExpression: "#discordID = :discordID",
      ExpressionAttributeNames: {
        "#discordID": "discordID", // Partition key
      },
      ExpressionAttributeValues: {
        ":discordID": discordID, // discordID from the event
      },
    };

    // Perform the query to DynamoDB
    const data = await dynamoDb.query(params).promise();

    if (data.Items) {
      const characterNames = data.Items.map(
        (item) => item.characterName
      );

      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "Character names fetched successfully",
            characterNames: characterNames,
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
          message: "Error fetching character names",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};

// module.exports.getUser = async (event) => {
//   try {
//     // Extract discordID from the event path parameters
//     const discordID = event.pathParameters.discordID;

//     // Query DynamoDB to fetch the character names for the given discordID
//     const params = {
//       TableName: "shismo-manager",
//       KeyConditionExpression: "#discordID = :discordID",
//       ExpressionAttributeNames: {
//         "#discordID": "discordID", // Partition key
//       },
//       ExpressionAttributeValues: {
//         ":discordID": discordID, // discordID from the event
//       },
//     };

//     // Perform the query to DynamoDB
//     const data = await dynamoDb.query(params).promise();

//     // Check if we found any items
//     if (data.Items && data.Items.length > 0) {
//       const characterNames = data.Items.map((item) => item.characterName);

//       return {
//         statusCode: 200,
//         body: JSON.stringify(
//           {
//             message: "Character names fetched successfully",
//             characterNames: characterNames,
//           },
//           null,
//           2
//         ),
//       };
//     } else {
//       return {
//         statusCode: 200,
//         body: JSON.stringify(
//           {
//             message: "No character names found for the given Discord ID",
//             characterNames: [],
//           },
//           null,
//           2
//         ),
//       };
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(
//         {
//           message: "Error fetching character names",
//           error: error.message,
//         },
//         null,
//         2
//       ),
//     };
//   }
// };

// module.exports.getCharacter = async (event) => {
//   try {
//     // Extract discordID and characterName from the event path parameters
//     const discordID = event.pathParameters.discordID;
//     const characterName = event.pathParameters.characterName;

//     // Query DynamoDB to fetch the tasks for the given discordID and characterName
//     const params = {
//       TableName: "shismo-manager",
//       KeyConditionExpression:
//         "#discordID = :discordID and #characterName = :characterName",
//       ExpressionAttributeNames: {
//         "#discordID": "discordID", // Partition key
//         "#characterName": "characterName", // Sort key
//       },
//       ExpressionAttributeValues: {
//         ":discordID": discordID, // discordID from the event
//         ":characterName": characterName, // characterName from the event
//       },
//     };

//     // Perform the query to DynamoDB
//     const data = await dynamoDb.query(params).promise();

//     // Check if we found any items
//     if (data.Items && data.Items.length > 0) {
//       // Assuming 'tasks' is a string attribute in the item
//       const items = data.Items[0];

//       return {
//         statusCode: 200,
//         body: JSON.stringify(
//           {
//             message: "Tasks fetched successfully",
//             item: items,
//           },
//           null,
//           2
//         ),
//       };
//     } else {
//       // No data found for the given discordID and characterName
//       return {
//         statusCode: 200,
//         body: JSON.stringify(
//           {
//             message: "No character found for the given discordID and characterName",
//             tasks: "",
//           },
//           null,
//           2
//         ),
//       };
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(
//         {
//           message: "Error fetching tasks",
//           error: error.message,
//         },
//         null,
//         2
//       ),
//     };
//   }
// };

module.exports.getTasks = async (event) => {
  try {
    // Extract discordID and characterName from the event path parameters
    const discordID = event.pathParameters.discordID;
    const characterName = event.pathParameters.characterName;

    // Query DynamoDB to fetch the tasks for the given discordID and characterName
    const params = {
      TableName: "shismo-websocket-connections",
      KeyConditionExpression:
        "#discordID = :discordID and #characterName = :characterName",
      ExpressionAttributeNames: {
        "#discordID": "discordID", // Partition key
        "#characterName": "characterName", // Sort key
      },
      ExpressionAttributeValues: {
        ":discordID": discordID, // discordID from the event
        ":characterName": characterName, // characterName from the event
      },
    };

    // Perform the query to DynamoDB
    const data = await dynamoDb.query(params).promise();

    // Check if we found any items
    if (data.Items) {
      // Assuming 'tasks' is a string attribute in the item
      const tasks = data.Items[0].tasks;

      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "Tasks fetched successfully",
            tasks: tasks == null ? [] : tasks,
          },
          null,
          2
        ),
      };
    } else {
      // No data found for the given discordID and characterName
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "No tasks found for the given discordID and characterName",
            tasks: "",
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
          message: "Error fetching tasks",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};

// module.exports.setTasks = async (event) => {
//   try {
//     // Extract discordID and characterName from the event path parameters
//     const discordID = event.pathParameters.discordID;
//     const characterName = event.pathParameters.characterName;

//     // Extract the tasks from the event body
//     const { tasks } = JSON.parse(event.body);

//     // Ensure that the tasks are provided
//     if (!tasks) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify(
//           {
//             message: "Tasks must be provided",
//           },
//           null,
//           2
//         ),
//       };
//     }

//     // Define the parameters to update the DynamoDB item
//     const params = {
//       TableName: "shismo-manager",
//       Key: {
//         discordID: discordID, // Partition key
//         characterName: characterName, // Sort key
//       },
//       UpdateExpression: "set #tasks = :tasks", // Update the tasks attribute
//       ExpressionAttributeNames: {
//         "#tasks": "tasks", // Attribute name for tasks
//       },
//       ExpressionAttributeValues: {
//         ":tasks": tasks, // The new tasks value
//       },
//       ReturnValues: "ALL_NEW", // Return the updated item
//     };

//     // Perform the update operation on DynamoDB
//     const data = await dynamoDb.update(params).promise();

//     // Return the updated data
//     return {
//       statusCode: 200,
//       body: JSON.stringify(
//         {
//           message: "Tasks updated successfully",
//           updatedItem: data.Attributes, // The updated item is returned here
//         },
//         null,
//         2
//       ),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(
//         {
//           message: "Error updating tasks",
//           error: error.message,
//         },
//         null,
//         2
//       ),
//     };
//   }
// };
