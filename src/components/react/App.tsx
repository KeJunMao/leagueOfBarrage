import { useSelector } from "react-redux";
import { RootState } from "../../store";
import UserPanel from "./UserPanel";

export default () => {
  const users = useSelector((state: RootState) => state.users.value);
  const sortUsers = users
    .filter((u) => u.mid > 0)
    .sort((a, b) => b.killCount - a.killCount);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {sortUsers.map((u, index) => (
        <UserPanel key={index} user={u} />
      ))}
    </div>
  );
};
