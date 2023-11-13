const bcrypt = require('bcrypt');
const auth = require('../auth');
const Teacher = require('../models/Teacher');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let client, database, dataCollection;

async function connectToDatabase() {
    client = new MongoClient(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@webportfolio.w5tlr5k.mongodb.net/?retryWrites=true&w=majority`, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await client.connect();
    database = client.db(process.env.DB_COLLECTION);
    dataCollection = database.collection('teachers');
};

async function closeDatabaseConnection() {
    database = null;
    dataCollection = null;
    await client.close();
}
