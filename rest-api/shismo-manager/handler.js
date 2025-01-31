"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const fetchData = async (tableName, discordID, characterName=null) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#discordID = :discordID",
    ExpressionAttributeNames: {
      "#discordID": "discordID",
    },
    ExpressionAttributeValues: {
      ":discordID": discordID,
    },
  };

  if (characterName !== null) {
    params.KeyConditionExpression += " and #characterName = :characterName";
    params.ExpressionAttributeNames["#characterName"] = "characterName";
    params.ExpressionAttributeValues[":characterName"] = characterName;
  }

  try {
    const data = await dynamoDb.query(params).promise();
    return data.Items || [];
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

const generateResponse = (statusCode, message, data) => ({
  statusCode,
  body: JSON.stringify({ message, ...data }, null, 2),
});

module.exports.getCharacters = async (event) => {
  const discordID = event.pathParameters.discordID;

  try {
    const data = await fetchData("shismo-websocket-connections", discordID);
    const characterNames = data ? data.map((item) => item.characterName) : [];

    return generateResponse(200, "Character names fetched successfully", {
      characterNames,
    });
  } catch (error) {
    return generateResponse(500, "Error fetching character names", {
      error: error.message,
    });
  }
};

module.exports.getTasks = async (event) => {
  const { discordID, characterName } = event.pathParameters;

  try {
    const data = await fetchData(
      "shismo-websocket-connections",
      discordID,
      characterName
    );
    const tasks = data ? data.tasks || [] : [];

    return generateResponse(200, "Tasks fetched successfully", { tasks });
  } catch (error) {
    return generateResponse(500, "Error fetching tasks", {
      error: error.message,
    });
  }
};

module.exports.getSkills = async (event) => {
  const { discordID, characterName } = event.pathParameters;

  try {
    const data = await fetchData(
      "shismo-websocket-connections",
      discordID,
      characterName
    );
    const skills = data ? data.skills || [] : [];

    return generateResponse(200, "Skills fetched successfully", { skills });
  } catch (error) {
    return generateResponse(500, "Error fetching skills", {
      error: error.message,
    });
  }
};

module.exports.getAll = async (event) => {
  const { discordID, characterName } = event.pathParameters;

  try {
    const data = await fetchData(
      "shismo-websocket-connections",
      discordID,
      characterName
    );

    if (data) {
      return generateResponse(200, "Data fetched successfully", { item: data });
    }

    return generateResponse(
      200,
      "No data found for the given discordID and characterName",
      { item: {} }
    );
  } catch (error) {
    return generateResponse(500, "Error fetching data", {
      error: error.message,
    });
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
