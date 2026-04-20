const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.sendHealTalk = functions.https.onRequest(async (req, res) => {

  const TOKEN = functions.config().telegram.token;
  const CHAT_ID = "7466422873";

  const { text, emosi } = req.body;

  const mesej = `
📩 HEAL TALK SPACE

😊 Emosi: ${emosi || "Tiada"}

📝 Luahan:
${text}

📍 HEALINK
`;

  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mesej
      })
    });

    res.send({ status: "success" });

  } catch (err) {
    res.status(500).send(err);
  }
});