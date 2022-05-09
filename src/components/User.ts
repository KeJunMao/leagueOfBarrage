import Team from "../enums/Team";
import LeagueOfBarrage from "./LeagueOfBarrage";
import Player from "./Player";

export class User {
  player!: Player;
  killCount: number = 0;
  constructor(public mid: number, public team: Team, public name: string) {}

  speak(text: string) {
    this.player?.speak(text);
  }

  static getUserByMid(mid: number): User | undefined {
    return LeagueOfBarrage.Core.users.find((user) => user.mid === mid);
  }
}
