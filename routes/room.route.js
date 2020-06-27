module.exports = app => {
    const room_controller = require('../controllers/room.controller');

    var router = require('express').Router();

    router.post('', room_controller.create);


    app.use('/api/rooms', router);
}