let applicationId = "ee63a5.vidyo.io";
let developerKey = "82b1d62562c04380b8aa5656211d737a";
let jsSHA = require('jssha');
let btoa = require('btoa');


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

exports.generateToken = (req, res) => {
    let thirtyMinutes = 30 * 60;
    let response = {
        token: generateToken(thirtyMinutes)
    };
    res.send(response);
}