const { OAuth2Client } = require('google-auth-library');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(googleClientId);

exports.verifyIdToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: googleClientId,
  });
  return ticket.getPayload() || {};
};
