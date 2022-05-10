import express from "express";
import fetch from "node-fetch";
import * as randomUseragent from "random-useragent";

const app = express();

async function getFaceByBilibili(id: number) {
  const url = `https://api.bilibili.com/x/space/acc/info?mid=${id}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": randomUseragent.getRandom(),
    },
  });
  const data = await response.json();
  const face = data?.data?.face ?? "";
  return face;
}
async function getFaceByTenApi(id: number) {
  const url = `https://tenapi.cn/bilibili/?uid=${id}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": randomUseragent.getRandom(),
    },
  });
  const data = await response.json();
  const face = data?.data?.avatar ?? "";
  return face;
}

app.get("/api/face/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let face = await getFaceByBilibili(id);
    if (!face) {
      face = await getFaceByTenApi(id);
    }
    if (!face) {
      face = "http://i0.hdslb.com/bfs/face/member/noface.jpg";
    }
    res.send({
      face,
    });
  } catch (err) {
    res.send({
      face: "",
    });
  }
});

export const handler = app;
