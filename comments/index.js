const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => console.log(err));

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("received event: ", req.body.type);
  const { type, data, content } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios.post("http://localhost:4005/events", {
      data: { id, postId, status, content },
      type: "CommentUpdated",
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
