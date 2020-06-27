module.exports = mongoose => {
    var schema = mongoose.Schema({
            room_name: String
        },
        {timestamps: true}
    );

    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Room = mongoose.model('rooms', schema);
    return Room;
};