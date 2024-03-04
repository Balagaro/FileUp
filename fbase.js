const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = {
    "type": "service_account",
    "project_id": "fileup-ca60c",
    "private_key_id": "0d9b96590ab335cecdb2ab5e09d42cd3f84bafee",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDS6yRHfRzN3Qst\nLhlRr+BwSuSQ+Tz+BFNX3aeVugbM/63Whjxv7KTH47mFGV0IE7m1pdZJOArLx97E\nbQ4YW6nhF9AzFC/+DUZRRLLrqQLYYz9W6VBbkzL8V+O2+pvDRpY8qnEf8v0XAC9G\ngsDmHnUfismpN2fpXBoEEDoWb7xYGDkvBQ8m1UN3sWLEyVAH7pffINV9tUwMTzZu\nxoMj+zwOgXchIZHKKa4kI5zt2jSu8J6OZhnyOyxFveM4Tpb/bg/aAwZh18wnsiQk\nCS/EO5wzZf2PiNRlu459W8z81QKp9aTmUnhblGTDvwl60SxZ6nXdbLHG4YrP7YRt\nCT3+Q4XxAgMBAAECggEALZSEuNFEEAX4lBkt/g3yw/mfVugRwvhG1YpwXKZAsX0A\ngYdtWKesfYkMLsQKK4RtweBWhGiwxpSJIuxJW0C138/AXcV7UJzoSQg+XTifRYl/\nJuZRSBTxtAA/VOvoDOV8cpxHyaZ+hMG0tblse95xo7EfvuqbEV5mveGO2AnqCyQ+\nhnlxn/FAfRjcqCyLSJ5Q4MeijAP9OHnihsyNuuRFvEebJS99BlrWiBiRuKo4IbrB\n43zNDjucN/tsROUTykgOk7RZIxgbRktJkHeFUQfO/27AigpnJanOAwGa8WuRc2Tp\nLhpcTbnOnP3EnaXAXH0mqKXdKHHo1T8aqpbLEFJ6tQKBgQDsjtV9vg+gwQyWy+wI\nY/7xNvT9M+dA0be2239WgwS6dIEBbMkrRRoUf07Q/wSytQEp0Enz3fqK/S5hmHM3\nOCnq4z2c0603aFJariErcSgyWsVUlQMXXcscUsLKBZ8xi37M1KIuMdeku3rZid0e\nIZnOokw8tMs9eIzS/xbobTqbrQKBgQDkQNsRPxLo9BE5HKMIM3/qtbNbLOfmt4F3\n+vCnrw6rx66BpaywCTfyag1YSR9lNb62jABB4PXB3haabpTFpoHHubDJU0oszkIf\neknBaGOjDRLqlnKu73TsXFuQhi7yKpdHgTyifzJZKKMp2xWTmZM1m2D9m6jAAEAA\nHRBJiP/b1QKBgBLQGTJy1xNVxwaHGTJhoXjVgg5Q/mctRosIUcwzh0C82zWdzTHf\nwP84ULBWV61Or9T/d6IpWS+Miw+/7AnMMak4gUHjo7bwWPxVNNYbnbLDfUYIw8Ir\n92c9PbiLUenCykbH8k3yMNAtCMwcJrWqvmysg5ugVTmCSNDO8KdzaGHRAoGAT9DS\nCfzZWvaF00fNRr/jeiqhlj9ktEv1DQSGBMz1P2JrBlDtyvzeQHmPQxEG1nhtwR3B\ntUe6CFnl44jJozfvZ+zqAeyLIpHZk3JKukQLm2el9rw3TC7V3xUIu8gAQJReJBXw\nIw6Bh6XrMGa4680nKfa0etpkrwcnWiLPoDc06SUCgYEA54Hprz5Q7MQuSFkNN63f\nOg9LR29IhtRtTIfsKbjrk9tFUo9LK9npN8w4GTPgVbVUkbmM10tWZ9oBUg6VpBUJ\ntK1mSVcJGXDqVD6VP0CcnwWAoOe9uQYYEFR2Fd9H3eYleEh/5HJ4u/viVeB6w022\nW7sSyThd5s/VBIZHJBaF3n0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-30woi@fileup-ca60c.iam.gserviceaccount.com",
    "client_id": "103292622664637711017",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-30woi%40fileup-ca60c.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

module.exports = { db }

