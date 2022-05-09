import express from "express";
import fetch from "node-fetch";
const app = express();

app.get("/api/face/:id", (req, res) => {
  const id = req.params.id;
  const url = `https://api.bilibili.com/x/space/acc/info?mid=${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { data: user } = data;
      const { face } = user;
      res.send({
        face,
      });
    });
});

export const handler = app;
