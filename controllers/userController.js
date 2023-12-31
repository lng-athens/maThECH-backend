const bcrypt = require('bcrypt');
const auth = require('../auth');
const User = require('../models/User');
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
    dataCollection = database.collection('users');
};

async function closeDatabaseConnection() {
    database = null;
    dataCollection = null;
    await client.close();
}

module.exports.signup = async (reqBody) => {
    try {
        const {firstName, middleName, lastName, email, mobile_no, password} = reqBody;
        await connectToDatabase();
        const filter = {email: email};

        const user = await dataCollection.findOne(filter);

        if (user) {
            return {success: false, message: 'Account already exist!'};
        }

        const hashedPassword = bcrypt.hash(password, 10);
        const newUser = new User({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: email,
            mobile_no: mobile_no,
            password: hashedPassword,
        });

        await dataCollection.insertOne(newUser);
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
    try {
        const {email, password} = reqBody;
        await connectToDatabase();
        const filter = {email: email};

        const user = await dataCollection.findOne(filter);
        if (!user) {
            return {success: false, message: 'Account does not exist!'};
        }

        const passMatch = bcrypt.compare(password, user.password);
        if (!passMatch) {
            return {success: false, message: 'Password does not match!'};
        }

        const token = auth.createAccessToken(user);
        return {success: true, message: 'Account logged in!', access: token};
    }
    catch (error) {
        return {success: false, message: error.message};
    }
    finally {
        await closeDatabaseConnection();
    }
};

module.exports.details = async (user) => {
    try {
        const {id} = user;
        await connectToDatabase();
        const userId = new ObjectId(id);
        const filter = {_id: userId};
        const options = {projection: {password: 0}};

        const userDetails = await dataCollection.findOne(filter, options);
        if (!userDetails) {
            return {success: false, message: 'Account not found!'};
        }

        return userDetails;
    }
    catch (error) {
        return {success: false, message: error.message};
    }
    finally {
        await closeDatabaseConnection();
    }
};