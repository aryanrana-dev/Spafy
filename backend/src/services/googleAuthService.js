import { OAuth2Client } from "google-auth-library";
import "dotenv/config";

const googleClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URL
})

export function getGoogleAuthURL() {
    const authUrl = googleClient.generateAuthUrl({
        access_type: "offline",
        scope: ["email", "profile"]
    })
    return authUrl;
}

export async function getGoogleUserInfo(code) {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload();
    const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name
    }
    return user;
}