import Player from "./Player";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  weapon!: Phaser.GameObjects.Sprite;
  lastAngle!: number;
  speed: number;
  fire(player: Player, x: number, y: number) {
    this.weapon = player.weapon;
    this.lastAngle = player.weapon.angle;
    this.setAngle(this.weapon.angle);
    const vec = this.scene.physics.velocityFromAngle(player.weapon.angle, 20);
    this.setPosition(x + vec.x, y + vec.y);
    this.setLive();
  }
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "bullet");
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.speed = Phaser.Math.GetSpeed(800, 0.1);
    this.setScale(0.1);
  }

  setDie() {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
  }
  setLive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  update(_time: number, delta: number) {
    if (this) {
      this.scene.physics.velocityFromAngle(
        this.lastAngle,
        this.speed * delta,
        this.body.velocity
      );
    }
    if (
      this.x < -50 ||
      this.x > (this.scene.game.config.width as number) + 50 ||
      this.y < -50 ||
      this.y > (this.scene.game.config.height as number) + 50
    ) {
      this.setDie();
    }
    // console.log(this.fire);
  }
}
