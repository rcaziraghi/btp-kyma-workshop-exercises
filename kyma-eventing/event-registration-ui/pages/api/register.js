const axios = require("axios");

export default async function handler(req, res) {

  var result = null;

  if (req.method === 'POST') {
    result = await axios.post(process.env.EVENT_EMITTER_ENDPOINT, req.body, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  if (result && result.data) {
    res.status(200).json(result.data);
  } else {
    res.status(200).json({ "message": "error" });
  }

}