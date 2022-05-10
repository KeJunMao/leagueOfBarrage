import MainScene from "./scenes/MainScene";
import { Flag } from "./Flag";
import Team from "../enums/Team";
import Bullet from "./Bullet";
import LeagueOfBarrage from "./LeagueOfBarrage";
import Anims from "../enums/Anims";
import HpBar from "./HpBar";
import { User } from "./User";
import Bubble from "./Bubble";
import CircleMaskImage from "phaser3-rex-plugins/plugins/circlemaskimage";

export default class Player extends Phaser.GameObjects.Container {
  mid: number;
  weapon!: Phaser.GameObjects.Sprite;
  tank!: Phaser.GameObjects.Sprite;
  target: Flag;
  team: Team;
  bullets: Phaser.GameObjects.Group;
  speed: number = 100;
  maxHp: number = 3;
  hp: number = this.maxHp;
  lastFired: number;
  power: number = 0.5;
  face!: CircleMaskImage;
  fireDelay: number;
  hpBar: HpBar;
  ammo: number = 10;
  area: number = 30;
  user: User;
  bubble!: Bubble;
  tween!: Phaser.Tweens.Tween;
  constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
    super(scene, x, y);

    this.scene = scene;
    const { mid, team } = user;
    this.user = user;
    this.user.player = this;
    this.mid = mid;
    this.team = team;
    this.target =
      team === Team.Red
        ? LeagueOfBarrage.Core.blueFlag
        : LeagueOfBarrage.Core.redFlag;
    this.scene.add.existing(this);
    this.lastFired = 0;
    this.fireDelay = 1000;

    this.bullets = this.scene.add.group({
      classType: Bullet,
      maxSize: this.ammo,
      runChildUpdate: true,
    });

    this.scene.anims.create({});

    const tankWidth = 32;
    const tankHeight = 32;
    this.tank = this.scene.add
      .sprite(-tankWidth / 2, -tankHeight / 2, "main", `${this.team}Tank0.png`)
      .setScale(0.5)
      .setOrigin(0);
    this.tank.anims.play(`${this.team}Run`);
    if (this.team === Team.Blue) {
      this.tank.setFlipX(true).clearTint();
    }
    this.weapon = this.scene.add
      .sprite(0, 0, "main", `${this.team}Weapon0.png`)
      .setScale(0.5)
      .setDisplayOrigin(16, 32);

    this.add([this.tank, this.weapon]);
    this.setSize(tankWidth, tankHeight);
    this.scene.physics.world.enable(this);

    this.bubble = new Bubble(this.scene);

    this.makeTween();

    if (team === Team.Red) {
      this.scene.physics.add.overlap(
        this.bullets,
        LeagueOfBarrage.Core.bluePlayerGroup,
        /// @ts-ignore
        this.onBulletOverlapsPlayer.bind(this)
      );
    } else {
      this.scene.physics.add.overlap(
        this.bullets,
        LeagueOfBarrage.Core.redPlayerGroup,
        /// @ts-ignore
        this.onBulletOverlapsPlayer.bind(this)
      );
    }

    this.hpBar = new HpBar(this.scene, this);
    this.add(this.hpBar);

    this.loadFace();
  }

  makeTween() {
    const tweenConfig = {
      targets: this.weapon,
      props: {
        angle: {
          from: this.team === Team.Red ? 0 - this.area : 180 + this.area,
          to: this.team === Team.Red ? 0 + this.area : 180 - this.area,
          yoyo: -1,
        },
      },
      duration: 2000,
      loop: -1,
    };
    if (this.tween) {
      this.tween.remove();
    }
    this.tween = this.scene.tweens.add(tweenConfig);
  }

  onBulletOverlapsPlayer(bullet: Bullet, player: Player) {
    bullet.setDie();
    player.hp = player.hp - this.power;
    if (player.isDie) {
      this.user.killCount += 1;
    }
  }

  get isDie() {
    return this.hp <= 0;
  }

  speak(text: string) {
    if (!this.isDie) {
      this.bubble.showContent(text);
    }
  }

  async loadFace() {
    if (!this.scene) return;
    const url = `/api/face/${this.mid}`;
    const response = await fetch(url);
    const data = await response.json();
    const { face } = data;
    this.user.faceUrl = face;
    const key = `${this.mid}-face`;
    this.scene.load.image(key, face);
    this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.face = new CircleMaskImage(
        this.scene,
        this.team === Team.Red ? -4 : 4,
        0,
        key
      );
      this.face.setDisplaySize(16, 16);
      this.scene.add.existing(this.face);
      this.add(this.face);
    });
    this.scene.load.start();
  }

  setDie() {
    this.hpBar.setDie();
    this.setActive(false);
    if (this.visible) {
      this.tank.setOrigin(0.5);
      this.tank.setPosition(0, 0);
      this.weapon.setVisible(false);
      this.tank.anims
        .play(Anims.Boom)
        .on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          this.setVisible(false);
          (this.body as Phaser.Physics.Arcade.Body).enable = false;
          if (this.team === Team.Red) {
            LeagueOfBarrage.Core.redPlayerGroup.remove(this);
          } else {
            LeagueOfBarrage.Core.bluePlayerGroup.remove(this);
          }
          // 重生
          LeagueOfBarrage.Core.makePlayer(this.user);
        });
    }
  }

  update(time: number, _delta: number): void {
    this.hpBar.update();
    this.bubble.setPosition(this.x - 10, this.y - 45);
    const scene = this.scene as MainScene;
    if (LeagueOfBarrage.Core.isGameStart !== -1) {
      return;
    }
    scene.physics.moveTo(this, this.target.x, this.target.y, this.speed);
    if (this.isDie) {
      this.setDie();
      return;
    }
    if (this.x > 0 && time > this.lastFired) {
      const bullet: Bullet = this.bullets.get();
      if (bullet) {
        bullet.fire(this, this.x, this.y);
        this.lastFired = time + this.fireDelay;
      }
    }
  }
}
