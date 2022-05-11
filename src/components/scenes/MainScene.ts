import { Scene } from "phaser";
import Scenes from "../../enums/Scenes";
import LeagueOfBarrage from "../LeagueOfBarrage";

export default class MainScene extends Scene {
  counter!: Phaser.GameObjects.Text;
  lastTime: number = 0;
  constructor() {
    super({
      key: Scenes.MainScene,
    });
  }

  create() {
    LeagueOfBarrage.Core.initGame(this);
    this.counter = this.add.text(
      this.renderer.width / 2,
      this.renderer.height / 2,
      String(LeagueOfBarrage.Core.isGameStart),
      {
        fontSize: "80px",
        align: "center",
      }
    );
  }
  update(time: number) {
    if (time >= this.lastTime) {
      if (LeagueOfBarrage.Core.isGameStart >= 0) {
        let text = String(LeagueOfBarrage.Core.isGameStart);
        if (LeagueOfBarrage.Core.isGameStart <= 0) {
          text = "开始";
        }
        this.counter.setText(text);
        this.counter.setPosition(
          this.renderer.width / 2 - this.counter.displayWidth / 2,
          this.renderer.height / 2 - this.counter.displayHeight / 2
        );

        this.lastTime = time + 1000;
        LeagueOfBarrage.Core.isGameStart--;
      } else {
        this.counter.setVisible(false);
      }
    }
    LeagueOfBarrage.Core.update(time);
  }
}
