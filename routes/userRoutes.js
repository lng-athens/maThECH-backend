const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../auth');

router.post('/signup', (req, res) => {
    userController.signup(req.body).then(resultFromController => res.send(resultFromController));
});

router.post('/login', (req, res) => {
    userController.login(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/details', auth.verify, (req, res) => {
    let userData = auth.decode(req.headers.authorization);

    userController.details(userData).then(resultFromController => res.send(resultFromController));
});

module.exports = router;