/**
 *
 *  Homework Assignment #1
 *
 *  Primary file for the API
 *
 *
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Instantiate the HTTP server
const Server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the  path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the notFound handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send the handler
    const data = {
      trimmedPath,
      payload: buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      // Use the payload called back by the handler, or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.end(payloadString);
    });
  });
});

// Start the HTTP server
Server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

// Define the handlers
let handlers = {};

handlers.hello = (data, callback) => {
  callback(200, { msg: "Hello World!!!" });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404, { error: "Not Found!!!" });
};

// Define a request router
const router = {
  hello: handlers.hello
};
