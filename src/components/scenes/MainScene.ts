import { Scene } from "phaser";
import Scenes from "../../enums/Scenes";
import LeagueOfBarrage from "../LeagueOfBarrage";

export default class MainScene extends Scene {
  constructor() {
    super({
      key: Scenes.MainScene,
    });
  }

  create() {
    LeagueOfBarrage.Core.initGame(this);
  }
  update() {
    LeagueOfBarrage.Core.update();
  }
}
