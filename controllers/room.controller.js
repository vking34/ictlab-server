const db = require('../models');
const Room = db.rooms;

exports.create = (req, res) => {

    console.log(req.body);

    const room = new Room({
        room_name: req.body.room_name
    });

    room.save(room)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
}