import { Badge, Typography, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { FC } from "react";
import { User } from "../User";

interface UserPanelProps {
  user: User;
}

const UserPanel: FC<UserPanelProps> = ({ user }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" gutterBottom color="gold">
        {user.killCount}
      </Typography>
      <Box
        sx={{
          color: "white",
          mb: 1,
        }}
      >
        <img
          style={{
            height: "1em",
          }}
          src={`/source/${user.team}Tank0.png`}
          alt=""
        />{" "}
        x {user.life + 1}
      </Box>

      <Box
        sx={{
          my: 1,
        }}
      >
        <Badge badgeContent={`lv${user?.player?.level ?? 1}`}>
          <Avatar
            sx={{ width: 56, height: 56 }}
            alt={user.name}
            src={
              user.faceUrl || "http://i0.hdslb.com/bfs/face/member/noface.jpg"
            }
          ></Avatar>
        </Badge>
      </Box>
      <Typography
        sx={{
          minHeight: "3em",
        }}
        align="center"
        variant="subtitle2"
      >
        {user.name}
      </Typography>
    </Box>
  );
};

export default UserPanel;
