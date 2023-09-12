const swaggerAutogen = require("swagger-autogen")();
const fs = require('fs');
const path = require('path');
const doc = {
  info: {
    version: '1.0.0',            // by default: '1.0.0'
    title: 'Acer ABC OTA REST API',              // by default: 'REST API'
    description: 'ota protocol for acer ABC mobile app'         // by default: ''
  },
  host: 'localhost:4000',                 // by default: 'localhost:3000'
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
  definitions: {
    Auth: {
      id: "alex",
      password: "abcde",
      project: "abcde"
    },
    AppManifest: {
      name: 'label',
      package: 'package',
      version: {
        code: 'versionCode',
        name: 'versionName'
      }
    }
  }           // by default: empty object
};

const outputFile = '../swagger-output.json';
// const routes = fs.readdirSync("./routes").map(route => path.join("./routes", route));
const routes = ['./router.js'];
swaggerAutogen(outputFile, routes, doc)
