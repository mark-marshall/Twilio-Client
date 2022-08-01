const VoiceResponse = require('twilio').twiml.VoiceResponse

exports.handler = async function (context, event, callback) {
  // Extract the recipient number from the request
  const { recipientNumber } = event

  // Form new Twilio Voice Response
  const voiceResponse = new VoiceResponse()

  // This is the ID of the Twilio number you want to use
  const callerId = '+447830347040'

  // Use the TwiML Dial Verb to connect the call
  voiceResponse.dial({ callerId }, recipientNumber)

  return callback(null, voiceResponse)
}
