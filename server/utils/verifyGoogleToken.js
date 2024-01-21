const { OAuth2Client } = require("google-auth-library");
const ApiError = require("../exceptions/api-error");
const ERROR = require("../constants/ERROR");

const client = new OAuth2Client(
  "55773086295-8cii0pbgfo84ljjjkofortsp1np471u3.apps.googleusercontent.com",
);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "55773086295-8cii0pbgfo84ljjjkofortsp1np471u3.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const userInfo = {
      googleId: payload.sub,
      email: payload.email,
      username: payload.given_name,
      avatar: payload.picture,
    };

    return userInfo;
  } catch (error) {
    throw ApiError.BadRequest(ERROR.googleVerifyTokenException);
  }
}

module.exports = verifyGoogleToken;
