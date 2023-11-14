const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../auth');

router.post('/signup', (req, res) => {
    studentController.signup(req.body).then(resultFromController => res.send(resultFromController));
});

router.post('/login', (req, res) => {
    studentController.login(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/details', auth.verify, (req, res) => {
    let userData = auth.decode(req.headers.authorization);

    studentController.details(userData).then(resultFromController => res.send(resultFromController));
});

module.exports = router;