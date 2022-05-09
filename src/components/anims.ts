import Anims from "../enums/Anims";

export default class AnimsManger {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.makeTankRun();
    this.makeBoom();
  }

  makeBoom() {
    this.scene.anims.create({
      key: Anims.Boom,
      frames: this.scene.anims.generateFrameNames("main", {
        prefix: "boom",
        suffix: ".png",
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      // hideOnComplete: true,
      // repeat: ,
    });
  }

  makeTankRun() {
    this.scene.anims.create({
      key: Anims.RedRun,
      frames: this.scene.anims.generateFrameNames("main", {
        prefix: `redTank`,
        suffix: ".png",
        start: 0,
        end: 1,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.scene.anims.create({
      key: Anims.BlueRun,
      frames: this.scene.anims.generateFrameNames("main", {
        prefix: `blueTank`,
        suffix: ".png",
        start: 0,
        end: 1,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }
}
