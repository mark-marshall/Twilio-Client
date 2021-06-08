// ================== Type Imports ==================
import { Request, Response } from 'express';
import type { Twilio } from 'twilio';

// ================== Package Imports ==================
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');

// ================== Initialise Clients ==================
const client: Twilio = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const AccessToken = require('twilio').jwt.AccessToken;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

// ================== Initialise App ==================
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================== Endpoints ==================
// EP1: Sense check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Alive' });
});

// EP2: Auth token request
app.post('/auth', (req: Request, res: Response) => {
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_SID,
    process.env.TWILIO_API_SECRET
  );

  accessToken.identity = 'mm';
  const VoiceGrant = AccessToken.VoiceGrant;

  const grant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_APP_SID,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ token: accessToken.toJwt() }));
});

app.post('/makeCall', (req: Request, res: Response) => {
  console.log('req.body');
  let twiml;
  twiml = `
    <Response>
        <Dial callerId="+447830347040">${req.body.phoneNumber}</Dial>
    </Response>
`;
  res.type('text/xml');
  res.send(twiml);
});

module.exports = app;
