import {
  Badge,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
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
      <Box
        sx={{
          my: 1,
          position: "relative",
        }}
      >
        <Badge
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          badgeContent={
            <Box
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <img
                style={{
                  height: "1em",
                }}
                src={`/source/${user.team}Tank0.png`}
                alt=""
              />
              x {user.life}
            </Box>
          }
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              opacity: user.player ? 1 : 0.5,
            }}
            alt={user.name}
            src={
              user.faceUrl || "http://i0.hdslb.com/bfs/face/member/noface.jpg"
            }
          ></Avatar>
        </Badge>

        {user?.player?.isFullFire && (
          <Box
            className="animate__animated animate__bounce"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              animation: "rubberBand",
              animationDuration: "80ms",
              animationIterationCount: "infinite",
              marginTop: "-42px",
              marginLeft: "-28px",
              fontSize: "56px",
              opacity: 0.8,
            }}
          >
            🔥
          </Box>
        )}
        {user.player && (
          <CircularProgress
            size={60}
            variant="determinate"
            value={(user?.player.hp / user?.player.maxHp) * 100}
            sx={{
              color: user.team,
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-30px",
              marginLeft: "-30px",
            }}
          />
        )}
      </Box>
      <Typography align="center" noWrap variant="body2">
        {user.name}
      </Typography>

      <Typography
        sx={{
          fontSize: "12px",
        }}
        color="gold"
      >
        {user?.player?.level ? `Lv ${user?.player?.level}` : "已阵亡"}
      </Typography>
      <Typography variant="body1" color="gold">
        <Box
          component="span"
          sx={{
            fontSize: "10px",
            zoom: "0.8",
          }}
        ></Box>
        {user.killCount === 0 ? "暂无击杀" : user.killCount}
      </Typography>
    </Box>
  );
};

export default UserPanel;
