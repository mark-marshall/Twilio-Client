"use strict";
exports.__esModule = true;
// ================== Package Imports ==================
var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var cors = require('cors');
// ================== Initialise Clients ==================
var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var AccessToken = require('twilio').jwt.AccessToken;
var VoiceResponse = require('twilio').twiml.VoiceResponse;
// ================== Initialise App ==================
var app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ================== Endpoints ==================
// EP1: Sense check
app.get('/', function (req, res) {
    res.status(200).json({ message: 'Alive' });
});
// EP2: Auth token request
app.post('/auth', function (req, res) {
    var accessToken = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_SID, process.env.TWILIO_API_SECRET);
    accessToken.identity = 'mm';
    var VoiceGrant = AccessToken.VoiceGrant;
    var grant = new VoiceGrant({
        outgoingApplicationSid: process.env.TWILIO_APP_SID,
        incomingAllow: true
    });
    accessToken.addGrant(grant);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ token: accessToken.toJwt() }));
});
app.post('/makeCall', function (req, res) {
    console.log('req.body');
    var twiml;
    twiml = "\n    <Response>\n        <Dial callerId=\"+447830347040\">" + req.body.phoneNumber + "</Dial>\n    </Response>\n";
    res.type('text/xml');
    res.send(twiml);
});
module.exports = app;
