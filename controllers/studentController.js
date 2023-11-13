const bcrypt = require('bcrypt');
const auth = require('../auth');
const Student = require('../models/Student');
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
    dataCollection = database.collection('students');
};

async function closeDatabaseConnection() {
    database = null;
    dataCollection = null;
    await client.close();
}

module.exports.signup = async (reqBody) => {
    try {
        const {firstName, middleName, lastName, email, password, role} = reqBody;
        await connectToDatabase();
        const filter = {email: email};

        const student = await dataCollection.findOne(filter);

        if (student) {
            return {success: false, message: 'Account already exist!'};
        }

        const hashedPassword = bcrypt.hash(password, 10);
        const newStudent = new Student({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
        });

        await dataCollection.insertOne(newStudent);
        return {success: true, message: 'Account successfuly created!'};
    }
    catch (error) {
        return {success: false, message: error.message};
    }
    finally {
        await closeDatabaseConnection();
    }
};