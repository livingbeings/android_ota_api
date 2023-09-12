const swaggerAutogen = require("swagger-autogen")();
const fs = require('fs');
const path = require('path');
const doc = {
  info: {
    version: '1.0.0',            // by default: '1.0.0'
    title: 'Acer ABC OTA REST API',              // by default: 'REST API'
    description: 'ota protocol for acer ABC mobile app'         // by default: ''
  },
  host: 'ota.kbro.xtaiwan.org',                 // by default: 'localhost:3000'
  basePath: '/',             // by default: '/'
  schemes: ['http', 'https'],              // by default: ['http']
  consumes: ['application/json'],             // by default: ['application/json']
  produces: ['application/json'],             // by default: ['application/json']
  tags: [                   // by default: empty Array
    {
      name: 'Android',             // Tag name
      description: 'REST API for Andorid APK OTA'       // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {}           // by default: empty object
};

const outputFile = './swagger-output.json';
const routes = fs.readdirSync("./routes").map(route => path.join("./routes", route));
swaggerAutogen(outputFile, routes, doc)
