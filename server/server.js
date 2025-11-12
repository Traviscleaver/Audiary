// server.js
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client();

const ANDROID_CLIENT_ID =
  "199986303921-dm03adsbp5kugohgu2vjg0vr3dub67nv.apps.googleusercontent.com";

app.post("/auth/google", async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).send("Missing id_token");

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: [ANDROID_CLIENT_ID], // only accept Android client ids
    });

    const payload = ticket.getPayload();
    // upsert user, issue your own JWT, etc.
    res.json({ success: true, user: { display_name: payload.name }, token: "demo" });
  } catch (e) {
    res.status(400).send(e?.message || "Google login failed");
  }
});
