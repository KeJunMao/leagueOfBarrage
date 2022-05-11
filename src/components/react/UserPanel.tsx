import { FC } from "react";
import { User } from "../User";

interface UserPanelProps {
  user: User;
}

const UserPanel: FC<UserPanelProps> = ({ user }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          textAlign: "center",
          marginBottom: "5px",
          height: "25px",
        }}
      >
        {user.name}
      </div>
      <div
        style={{
          width: "64px",
          height: "64px",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            border: `1px solid ${user.team}`,
          }}
          src={user.faceUrl || "http://i0.hdslb.com/bfs/face/member/noface.jpg"}
          alt=""
        />
      </div>
      <div
        style={{
          fontSize: "25px",
          fontWeight: "bolder",
          color: "gold",
        }}
      >
        {user.killCount}
      </div>
    </div>
  );
};

export default UserPanel;
