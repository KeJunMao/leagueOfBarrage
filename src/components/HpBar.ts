import NumberBar from "phaser3-rex-plugins/templates/ui/numberbar/NumberBar";
import type RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import Team from "../enums/Team";
import Player from "./Player";
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0xfffef7;
const COLOR_DARK = 0x260e04;

export default class HpBar extends Phaser.GameObjects.Container {
  rexUI: RexUIPlugin;
  bar: NumberBar;
  player: Player;
  constructor(scene: Phaser.Scene, player: Player) {
    super(scene);
    this.scene = scene;
    this.rexUI = scene.rexUI;
    this.player = player;
    // this.text =
    this.bar = this.rexUI.add
      .numberBar({
        x: 0,
        y: 0,
        width: 32,

        background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),

        slider: {
          track: this.rexUI.add.roundRectangle(0, 0, 0, 5, 0, COLOR_PRIMARY),
          indicator: this.rexUI.add.roundRectangle(0, 0, 0, 5, 0, COLOR_LIGHT),
          input: "click",
        },
        text: this.scene.add.text(0, 0, "x2", {
          fontSize: "10px",
        }),
        space: {},
      })
      .layout();
    this.bar.setValue(this.player.hp, 0, this.player.maxHp);
    this.add(this.bar);
  }
  update(): void {
    this.bar.setPosition(
      this.player.x -
        (this.player.team === Team.Red
          ? this.bar.width / 4
          : -this.bar.width / 4),
      this.player.y + 32
    );
    const text = `x${this.player?.user?.life + 1 ?? 2}`;
    this.bar.setText(text);
    this.bar.setValue(this.player.hp, 0, this.player.maxHp);
  }

  setDie() {
    this.removeAll(true);
    this.scene.children.remove(this.bar);
    this.scene.children.remove(this);
  }
}
