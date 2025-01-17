"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getUser = async(event) => {
    try {
        // Extract discordID from the event path parameters
        const discordID = event.pathParameters.discordID;

        // Query DynamoDB to fetch the character names for the given discordID
        const params = {
            TableName: "shismo-manager",
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

        // Check if we found any items
        if (data.Items && data.Items.length > 0) {
            const characterNames = data.Items.map((item) => item.characterName);

            return {
                statusCode: 200,
                body: JSON.stringify({
                        message: "Character names fetched successfully",
                        characterNames: characterNames,
                    },
                    null,
                    2
                ),
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({
                        message: "No character names found for the given Discord ID",
                        characterNames: [],
                    },
                    null,
                    2
                ),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                    message: "Error fetching character names",
                    error: error.message,
                },
                null,
                2
            ),
        };
    }
};

module.exports.getTasks = async (event) => {
  try {
    // Extract discordID and characterName from the event path parameters
    const discordID = event.pathParameters.discordID;
    const characterName = event.pathParameters.characterName;

    // Query DynamoDB to fetch the tasks for the given discordID and characterName
    const params = {
      TableName: "shismo-manager",
      KeyConditionExpression: "#discordID = :discordID and #characterName = :characterName",
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
    if (data.Items && data.Items.length > 0) {
      // Assuming 'tasks' is a string attribute in the item
      const tasks = data.Items[0].tasks;

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Tasks fetched successfully",
          tasks: tasks,
        }, null, 2),
      };
    } else {
      // No data found for the given discordID and characterName
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No tasks found for the given discordID and characterName",
          tasks: "",
        }, null, 2),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching tasks",
        error: error.message,
      }, null, 2),
    };
  }
};

// async function setTasks(userId, characterName, tasks) {
//     const tasksParam = tasks ? tasks : [];

//     const params = {
//         TableName: "shismo-manager",
//         Item: {
//             discordID: userId,
//             characterName: characterName,
//             tasks: tasksParam, // Optional tasks parameter
//             timestamp: new Date().toISOString(), // Optional timestamp field for when the task was set
//         },
//     };

//     try {
//         await dynamoDb.put(params).promise();
//         console.log(`Tasks for ${characterName} set successfully`);
//     } catch (error) {
//         console.error(`Error setting tasks for ${characterName}:`, error);
//         throw error;
//     }
// }

// module.exports.putUser = async(event) => {
//     try {
//         // Extract the body data from the event
//         const {
//             userId,
//             characterName,
//             tasks
//         } = JSON.parse(event.body);

//         // Validate the input data
//         if (!userId || !characterName) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({
//                         message: "userId and characterName are required."
//                     },
//                     null,
//                     2
//                 ),
//             };
//         }

//         // Write to DynamoDB
//         const params = {
//             TableName: "shismo-manager",
//             Item: {
//                 discordID: userId, // Partition key
//                 characterName: characterName, // Sort key
//                 tasks: tasks || [], // Optional tasks, default to empty array
//                 timestamp: new Date().toISOString(),
//             },
//         };

//         // Perform the put operation
//         await dynamoDb.put(params).promise();

//         // Call setTasks function to handle tasks
//         await setTasks(userId, characterName, tasks);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                     message: "User data and tasks saved successfully",
//                     userId,
//                     characterName,
//                 },
//                 null,
//                 2
//             ),
//         };
//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                     message: "Error saving user data",
//                     error: error.message,
//                 },
//                 null,
//                 2
//             ),
//         };
//     }
// };