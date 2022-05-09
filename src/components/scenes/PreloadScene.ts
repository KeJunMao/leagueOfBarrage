import { Scene } from "phaser";
import Scenes from "../../enums/Scenes";
import Core from "../Core";
import LeagueOfBarrage from "../LeagueOfBarrage";
import SceneManager from "../SceneManger";

export default class PreloadScene extends Scene {
  constructor() {
    super({ key: Scenes.PreloadScene });
  }

  preload() {
    this.load.image("flag", "/flag.png");
    this.load.image("bullet", "/bullet.png");
    this.load.image("tiles", "/muddy-ground.png");
    this.load.multiatlas("main", "/sprite/main.json", "/sprite");
  }

  create() {
    LeagueOfBarrage.Core = new Core(this.game, this);
    LeagueOfBarrage.Core.sceneManager = new SceneManager(this.game, this.scene);
    this.scene.start(Scenes.MainScene);
  }
}
