import Team from "../enums/Team";
import LeagueOfBarrage from "./LeagueOfBarrage";
import Player from "./Player";
import PowerUp from "./PowerUp";

export class User {
  player: Player | undefined;
  killCount: number = 0;
  faceUrl: string = "";
  life: number = 3;
  powerUps: PowerUp[] = [];
  xp: number = 0;
  constructor(public mid: number, public team: Team, public name: string) {
    const teamString = team === Team.Red ? "红队" : "蓝队";
    if (mid > 0) {
      LeagueOfBarrage.Core.toast.showMessage(`${name} 加入了 ${teamString}`);
    }
  }

  speak(text: string) {
    this.player?.speak(text);
  }

  static getUserByMid(mid: number): User | undefined {
    const { users } = LeagueOfBarrage.Core.store.getState();
    // return LeagueOfBarrage.Core.store
    return users.value.find((user) => user.mid === mid);
  }
}
