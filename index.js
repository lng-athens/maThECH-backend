const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.SERVER_PORT || 3000;

const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    const origin = req.headers.origin;

    if(allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization,x-requested-with');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);

app.listen(port, () => console.log(`Server is now running at port ${port}`));