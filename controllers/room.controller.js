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

exports.getAll = (req, res) => {
    Room.find()
        .then(rooms => {
            res.send(rooms);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving rooms."
            });
        })
};

exports.getOne = (req, res) => {
    const id = req.params.id;

    Room.findById(id)
        .then(room => {
            if (!room){
                res.status.send({message: 'Room not found!'});
            }
            else
                res.send(room);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Room with id=" + id });
        });
};
