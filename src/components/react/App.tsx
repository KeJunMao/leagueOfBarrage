import { useSelector } from "react-redux";
import { RootState } from "../../store";
import UserPanel from "./UserPanel";

const GiftItem = ({ url, text }: { url?: string; text: string }) => {
  return (
    <div
      style={{
        marginRight: "10px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {url && (
        <img
          style={{
            height: "1.5rem",
          }}
          src={url}
          alt=""
        />
      )}
      {text}
    </div>
  );
};

export default () => {
  const users = useSelector((state: RootState) => state.users.value);
  const sortUsers = users
    .filter((u) => u.mid > 0)
    .sort((a, b) => b.killCount - a.killCount);

  return (
    <div>
      <div
        style={{
          display: "flex",
          minHeight: "134px",
        }}
      >
        {sortUsers.map((u, index) => (
          <UserPanel key={index} user={u} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>发送：</div>
        <GiftItem
          url="http://i0.hdslb.com/bfs/live/bbd9045570d0c022a984c637e406cb0e1f208aa9.png"
          text="恢复血量"
        ></GiftItem>
        <GiftItem
          url="http://i0.hdslb.com/bfs/live/fa1eb4dce3ad198bb8650499830560886ce1116c.png"
          text="10%概率获得强化"
        ></GiftItem>
        <div
          style={{
            marginLeft: "10px",
          }}
        >
          投喂：
        </div>
        <GiftItem
          url="https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png@80w_80h_1e_1c.png"
          text="辣条低级强化"
        ></GiftItem>
        <GiftItem text="小心心中级强化"></GiftItem>
        <GiftItem
          url="https://s1.hdslb.com/bfs/live/92c5258517d1477797b54c5fdaeb8c66dc962ed6.png@80w_80h_1e_1c.png"
          text="小花花高级强化"
        ></GiftItem>
        <GiftItem
          url="https://s1.hdslb.com/bfs/live/79b6d0533fc988f2800fc5bb4fe3722c825f746f.png@80w_80h_1e_1c.png"
          text="打Call超级强化"
        ></GiftItem>
        <div
          style={{
            marginLeft: "10px",
          }}
        >
          复活：投喂任意礼物，若包含强化直接强化
        </div>
      </div>
    </div>
  );
};
