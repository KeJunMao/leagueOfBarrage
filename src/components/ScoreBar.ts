import NumberBar from "phaser3-rex-plugins/templates/ui/numberbar/NumberBar";
import type RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import LeagueOfBarrage from "./LeagueOfBarrage";
const COLOR_LIGHT = 0x000eff;
const COLOR_DARK = 0xff0e04;

export default class ScoreBar extends Phaser.GameObjects.Container {
  rexUI: RexUIPlugin;
  bar: NumberBar;
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene = scene;
    this.rexUI = scene.rexUI;
    this.bar = this.rexUI.add
      .numberBar({
        x: this.scene.renderer.width / 2,
        y: 10,
        width: this.scene.renderer.width - 20,

        background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_DARK),

        slider: {
          track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_LIGHT),
          indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_DARK),
          input: "click",
        },

        space: {},
      })
      .layout();
    this.add(this.bar);
  }
  update(): void {
    let value = LeagueOfBarrage.Core.redPlayerGroup.children.size;

    let maxValue =
      LeagueOfBarrage.Core.redPlayerGroup.children.size +
      LeagueOfBarrage.Core.bluePlayerGroup.children.size;
    if (maxValue === 0) {
      maxValue = 2;
      value = 1;
    }
    this.bar.setValue(value, 0, maxValue);
  }
}
