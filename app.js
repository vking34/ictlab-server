let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let http = require('http');
let https = require('https');
let fs = require('fs');
const cors = require("cors");
const bodyParser = require("body-parser");

var corsOptions = {
    origin: "http://localhost:3000"
};

let applicationId = "ee63a5.vidyo.io";
let developerKey = "82b1d62562c04380b8aa5656211d737a";

let options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(9999));
}

function generateToken(expiresInSeconds) {
    var EPOCH_SECONDS = 62167219200;
    var expires = Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
    var shaObj = new jsSHA("SHA-384", "TEXT");
    shaObj.setHMACKey(developerKey, "TEXT");
    jid = "demoUser" + getRandomInt() + '@' + applicationId;
    var body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00';
    shaObj.update(body);
    var mac = shaObj.getHMAC("HEX");
    var serialized = body + '\0' + mac;
    return btoa(serialized);
}


let app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json());
app.use(express.static('public'))
// app.use('/rooms', roomRouter);

const db = require('./models');
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// app.get('/token', (req, res) => {
//     let thirtyMinutes = 30 * 60;
//     let response = {
//         token: generateToken(thirtyMinutes)
//     };
//     res.json(response);
// })

// app.get('/rooms', (req, res) => {
//     let room = {
//         room_id: 'aaa',
//         room_name: 'AAA'
//     };
//
//     MongoClient.connect(url, (err, db) => {
//         if (err) throw err;
//         var dbo = db.db("ictlab");
//         dbo.collection("rooms").insertOne(room, function (err, res) {
//             if (err) throw err;
//             console.log(res);
//             db.close();
//         })
//     });
//
//     res.send(JSON.stringify(room));
// });

// app.listen(port, () => console.log(`Listening on port ${port}!`))

require('./routes/room.route.js')(app);
require('./routes/token.route.js')(app);

const http_port = 3000;
const https_port = 8443;

http.createServer(app).listen(http_port, () => console.log(`Listening on port ${http_port}!`));
https.createServer(options, app).listen(https_port, () => console.log(`Listening on port ${https_port}!`));

module.exports = app;
