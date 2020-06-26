let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let jsSHA = require('jssha');
let btoa = require('btoa');
let http = require('http');
let https = require('https');
let fs = require('fs');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

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
app.use(express.static('public'))

app.get('/token', (req, res) => {
  let thirtyMinutes = 30 * 60;
  let response = JSON.stringify({
    token: generateToken(thirtyMinutes)
  });
  res.send(response);
})

// app.listen(port, () => console.log(`Listening on port ${port}!`))

const http_port = 3000;
const https_port = 8443;

http.createServer(app).listen(http_port, () => console.log(`Listening on port ${http_port}!`));
https.createServer(options, app).listen(https_port, () => console.log(`Listening on port ${https_port}!`));

module.exports = app;
