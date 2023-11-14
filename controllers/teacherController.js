const bcrypt = require('bcrypt');
const auth = require('../auth');
const Teacher = require('../models/Teacher');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let client, database, dataCollection;

async function connectToDatabase() {
    client = new MongoClient(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@webportfolio.w5tlr5k.mongodb.net/maThECH?retryWrites=true&w=majority`, {
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

module.exports.signup = async (reqBody) => {
    try {
        const {firstName, middleName, lastName, email, password} = reqBody;
        await connectToDatabase();
        const filter = {email: email};

        const teacher = await dataCollection.findOne(filter);

        if (teacher) {
            return {success: false, message: 'Account already exist!'};
        }

        const hashedPassword = bcrypt.hash(password, 10);
        const newTeacher = new Teacher({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
        });

        await dataCollection.insertOne(newTeacher);
        return {success: true, message: 'Account successfuly created!'};
    }
    catch (error) {
        return {success: false, message: error.message};
    }
    finally {
        await closeDatabaseConnection();
    }
};

module.exports.login = async (reqBody) => {
    try{
        const {email, password} = reqBody;
        await connectToDatabase();
        const filter = {email: email};

        const teacher = await dataCollection.findOne(filter);
        if (!teacher) {
            return {success: false, message: 'Account does not exist!'};
        }

        const passMatch = bcrypt.compare(password, teacher.password);
        if (!passMatch) {
            return {success: false, message: 'Password does not match!'};
        }

        const token = auth.createAccessToken(teacher);
        return {success: true, message: 'Account logged in!', access: token};
    }
    catch (error) {
        return {success: false, message: error.message};
    }
    finally {
        await closeDatabaseConnection();
    }
};