import { Game } from "phaser";
import Core from "./Core";
import MainScene from "./scenes/MainScene";
import PreloadScene from "./scenes/PreloadScene";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import ScoreScene from "./scenes/ScoreScene";
export default class LeagueOfBarrage extends Game {
  static Core: Core;

  constructor() {
    super({
      type: Phaser.AUTO,
      backgroundColor: "#000",
      parent: "game",
      scale: {
        width: 1280,
        height: 520,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      },
      plugins: {
        scene: [
          {
            key: "rexUI",
            plugin: UIPlugin,
            mapping: "rexUI",
          },
        ],
      },
      scene: [PreloadScene, MainScene, ScoreScene],
      physics: {
        default: "arcade",
        arcade: {
          // debug: true,
        },
      },
    });
  }
}
