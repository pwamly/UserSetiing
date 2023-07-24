// apiService.js

define([
    'dojo/request' // Import the request module
  ], function (request) {
  
    return {
      // Export a function to perform the API POST request
      postToApi: function(apiEndpoint, data) {
        return request.post(apiEndpoint, {
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(data)
        });
      }
    };
  });
  