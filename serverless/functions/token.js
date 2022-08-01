const AccessToken = require('twilio').jwt.AccessToken

exports.handler = function (context, event, callback) {
  // Form new Twilio Response
  const response = new Twilio.Response()

  // Set headers to allow CORS
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.appendHeader('Content-Type', 'application/json')

  // Form new Voice Grant for the token
  const VoiceGrant = AccessToken.VoiceGrant

  // Used when generating any kind of tokens
  const {
    ACCOUNT_SID: accountSid,
    API_KEY_SID: apiKeySid,
    API_SECRET: apiSecret,
    OUTGOING_APP_SID: outgoingAppSid
  } = context

  const { identity } = event

  // Create a "grant" which enables a client to use Voice as a given user
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingAppSid,
    incomingAllow: true // Optional: add to allow incoming calls
  })

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(accountSid, apiKeySid, apiSecret, {
    identity
  })

  // Add the grant to the token
  token.addGrant(voiceGrant)

  // Serialize the token to a JWT string
  response.setBody(token.toJwt())

  return callback(null, response)
}
