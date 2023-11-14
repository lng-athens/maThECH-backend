const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../auth');

router.post('/signup', (req, res) => {
    teacherController.signup(req.body).then(resultFromController => res.send(resultFromController));
});

router.post('/login', (req, res) => {
    teacherController.login(req.body).then(resultFromController => res.send(resultFromController));
});

module.exports = router;