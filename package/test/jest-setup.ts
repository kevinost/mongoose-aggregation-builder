const path = require('path');
const dotenvAbsolutePath = path.join(__dirname, '.env');
import { MongoMemoryServer } from 'mongodb-memory-server';

require('dotenv').config({
    path: dotenvAbsolutePath,
});

module.exports = async function globalSetup() {
    const instance = await MongoMemoryServer.create();
    (global as any).__MONGOINSTANCE = instance; // Only available in the globalSetup/Teardown context

    // Use this to connect to mongo
    const uri = instance.getUri();
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
};

//
// require('leaked-handles').set({
//     fullStack: true, // use full stack traces
//     timeout: 15000, // run every 15 seconds instead of 5 (for mongo memory db).
//     debugSockets: true // pretty print tcp thrown exceptions.
// });
