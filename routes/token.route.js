module.exports = app => {
    const token_controller = require('../controllers/token.controller');
    var router = require('express').Router();

    router.get('', token_controller.generateToken);

    app.use('/api/token', router);
};
