const dotenv = require("dotenv");
dotenv.config({ path: ".env" });


const serviceAccount = {
  type: "service_account",
  project_id: "smartdairy-flash-notifi",
  private_key_id: process.env.FCMPRIVATE_KEY_ID,
  private_key: process.env.FCMPRIVATE_KEY.replace(/\\n/g, "\n"), // Replace \n with actual newlines
  client_email: process.env.FCMCLIENT_MAIL,
  client_id: process.env.FCMCLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};


// Example: Initialize Firebase Admin SDK
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

