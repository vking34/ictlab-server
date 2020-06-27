module.exports = app => {
    const room_controller = require('../controllers/room.controller');

    var router = require('express').Router();

    router.post('', room_controller.create);
    router.get('', room_controller.getAll);
    router.get('/:id', room_controller.getOne);

    app.use('/api/rooms', router);
};
