import Scenes from "../../enums/Scenes";
import Team from "../../enums/Team";
import LeagueOfBarrage from "../LeagueOfBarrage";
import { User } from "../User";

export default class ScoreScene extends Phaser.Scene {
  constructor() {
    super({
      key: Scenes.ScoreScene,
    });
  }

  create() {
    this.add
      .rectangle(0, 0, this.renderer.width, this.renderer.height, 0x000000)
      .setOrigin(0)
      .setAlpha(0.5);
    const title = this.makeTitle();
    const sizer = this.rexUI.add
      .sizer(
        this.renderer.width / 2,
        this.renderer.height / 2,
        this.renderer.width,
        this.renderer.height - 80,
        {
          orientation: "y",
        }
      )
      .add(title)
      .add(this.makeBoardWapper(), {
        padding: {
          top: 20,
        },
      });
    sizer.layout();
  }

  getTeamString(team = LeagueOfBarrage.Core.winTeam) {
    return team === Team.Red ? "红方" : "蓝方";
  }

  makeTitle() {
    const teamString = this.getTeamString();
    return this.add.text(0, 0, `${teamString}胜利！`, {
      fontSize: "32px",
      color: "white",
    });
  }
  makeBoardWapper() {
    return this.rexUI.add
      .sizer(0, 0, this.renderer.width / 2, 300, {
        orientation: "x",
      })
      .add(this.makeBoard(Team.Red))
      .add(this.makeBoard(Team.Blue));
  }

  makeBoard(team: Team) {
    const teamString = this.getTeamString(team);
    const sizer = this.rexUI.add
      .sizer(0, 0, this.renderer.width / 2, 300, {
        orientation: "y",
      })
      .add(this.add.text(0, 0, teamString), {
        padding: {
          bottom: 20,
        },
      });
    const { users } = LeagueOfBarrage.Core.store.getState();
    users.value.sort((a, b) => b.killCount - a.killCount);
    const teamUsers = users.value.filter(
      (user) => user.team === team && user.mid > 0
    );
    teamUsers.forEach((user, index) => {
      if (index > 9) {
        return;
      }
      if (user.team === team) {
        sizer.add(this.makeUserScore(user, index));
      }
    });
    return sizer;
  }
  makeUserScore(user: User, index: number) {
    const colors = ["#ffd700", "#d0af12", "#a38a17"];
    const winTeam = LeagueOfBarrage.Core.winTeam;
    let color = colors[index] ?? "#fff";
    if (winTeam !== user.team && index > 0) {
      color = "#fff";
    }
    return this.rexUI.add
      .sizer(0, 0, 0, 25, {
        orientation: "x",
      })
      .add(
        this.add.text(0, 0, `${user.name} 击败 x${user.killCount}`, {
          color,
        })
      );
  }
}
