const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
  const event = req.body;
  await axios
    .post("http://localhost:4000/events", event)
    .catch((err) => console.log(err));
  await axios
    .post("http://localhost:4001/events", event)
    .catch((err) => console.log(err));
  await axios
    .post("http://localhost:4002/events", event)
    .catch((err) => console.log(err));
  await axios
    .post("http://localhost:4003/events", event)
    .catch((err) => console.log(err));

  res.send({ status: "ok" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
