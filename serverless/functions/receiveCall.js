const VoiceResponse = require('twilio').twiml.VoiceResponse

exports.handler = async function (context, event, callback) {
  // This is the ID of the client device
  const identity = 'mm'

  // Form new Twilio Voice Response
  const voiceResponse = new VoiceResponse()
  const dial = voiceResponse.dial()

  // Use the TwiML Dial Verb to connect the call
  dial.client(identity)

  return callback(null, voiceResponse)
}
