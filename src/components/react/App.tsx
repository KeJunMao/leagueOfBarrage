import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import GiftItem from "./GiftItem";
import UserPanel from "./UserPanel";

export default () => {
  const users = useSelector((state: RootState) => state.users.value);
  const danmuGifts = [
    {
      name: "点赞表情",
      img: "http://i0.hdslb.com/bfs/live/bbd9045570d0c022a984c637e406cb0e1f208aa9.png",
      content: "恢复1点血量",
    },
    {
      name: "打call表情",
      img: "http://i0.hdslb.com/bfs/live/fa1eb4dce3ad198bb8650499830560886ce1116c.png",
      content: "50%概率获得强化，若阵亡，50%概率复活",
    },
  ];
  const gifts = [
    ...danmuGifts,
    {
      name: "辣条",
      img: "https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png@80w_80h_1e_1c.png",
      content: "提升射速,恢复血量*N",
    },
    {
      name: "小心心",
      content: "提升射速,血量上限,恢复血量*N",
    },
    {
      name: "小花花",
      img: "https://s1.hdslb.com/bfs/live/92c5258517d1477797b54c5fdaeb8c66dc962ed6.png@80w_80h_1e_1c.png",
      content: "提升射速,移速,角度,弹速*N",
    },
    {
      name: "打call",
      img: "https://s1.hdslb.com/bfs/live/79b6d0533fc988f2800fc5bb4fe3722c825f746f.png@80w_80h_1e_1c.png",
      content: "大幅提升射速,移速,角度,弹速*N",
    },
  ];
  const sortUsers = users
    .filter((u) => u.mid > 0)
    .sort((a, b) => b.killCount - a.killCount)
    .filter((_u, index) => index < 10);
  if (sortUsers.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>发送任意弹幕或「红」、「蓝」 加入战斗</Typography>
        <Typography>Bug/意见反馈群号:250709125</Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Grid
        container
        spacing={1}
        columns={{
          xs: 41,
        }}
      >
        <Grid
          item
          xs={1}
          sx={{
            writingMode: "vertical-lr",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          英雄榜
        </Grid>
        {sortUsers.map((u, index) => (
          <Grid item key={index + u.mid} xs={4}>
            <UserPanel user={u} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 1,
        }}
      >
        <Grid container spacing={1}>
          {gifts.map((gift) => (
            <Grid item key={gift.name}>
              <GiftItem {...gift}></GiftItem>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
