'use strict';

module.exports.hello = async event => {
  try {
    // Extract discordID from the event path parameters
    const discordID = event.pathParameters.discordID;
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Discord ID: ' + discordID,
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Error',
          input: event,
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};

