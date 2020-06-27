const dbConfig = require('../configs/db.config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.rooms = require('./room.model.js')(mongoose);

module.exports = db;