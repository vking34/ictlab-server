let express = require('express');

let http = require('http');
let https = require('https');
let fs = require('fs');
const cors = require("cors");
const bodyParser = require("body-parser");

var corsOptions = {
    origin: "http://localhost:3000"
};

let options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

let app = express();

// app config
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

// dvb connection
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

// routes
require('./routes/room.route.js')(app);
require('./routes/token.route.js')(app);

const http_port = 3000;
const https_port = 8443;

http.createServer(app).listen(http_port, () => console.log(`Listening on port ${http_port}!`));
https.createServer(options, app).listen(https_port, () => console.log(`Listening on port ${https_port}!`));

module.exports = app;
