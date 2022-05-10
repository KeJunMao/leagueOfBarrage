import Team from "../enums/Team";

export class Flag extends Phaser.GameObjects.Sprite {
  team: Team;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "flag");
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setDisplaySize(32, 32);
    this.team = Team.Red;
  }
}

export class RedFlag extends Flag {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.team = Team.Red;
    this.setTexture("main", "redFlag0.png");
  }
}

export class BlueFlag extends Flag {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.team = Team.Blue;
    this.setTexture("main", "blueFlag0.png");
  }
}
