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
import PowerUp from "./PowerUp";
import { updateUser } from "../store/usersSlice";

export default class Player extends Phaser.GameObjects.Container {
  mid: number;
  weapon!: Phaser.GameObjects.Sprite;
  tank!: Phaser.GameObjects.Sprite;
  target: Flag;
  team: Team;
  bullets: Phaser.GameObjects.Group;
  bulletSpeed: number = 10;
  speed: number = 12;
  maxHp: number = 10;
  hp: number = this.maxHp;
  power: number = 1.5;
  fireDelay: number = 2000;
  rotateDuration = 2000;
  // ammo: number = 10;
  fullFireDelay = this.fireDelay;
  fullFireRotateDuration = this.rotateDuration;
  // fullFireAmmo = this.ammo;
  area: number = 30;
  lastFired: number;
  face!: CircleMaskImage;
  hpBar: HpBar;
  user: User;
  bubble!: Bubble;
  tween!: Phaser.Tweens.Tween;
  level = 1;
  // levelText!: Phaser.GameObjects.Text;
  isFullFire: boolean = false;
  tankWidth = 48;
  tankHeight = 48;
  receivingDamage: boolean = true;
  constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
    super(scene, x, y);

    this.scene = scene;
    const { mid, team } = user;
    this.user = user;
    this.user.player = this;
    this.user.life -= 1;
    LeagueOfBarrage.Core.store.dispatch(updateUser());

    this.mid = mid;
    this.team = team;
    this.target =
      team === Team.Red
        ? LeagueOfBarrage.Core.blueFlag
        : LeagueOfBarrage.Core.redFlag;
    this.scene.add.existing(this);
    this.lastFired = 0;

    this.bullets = this.scene.add.group({
      classType: Bullet,
      // maxSize: this.ammo,
      runChildUpdate: true,
    });

    this.scene.anims.create({});

    this.tank = this.scene.add
      .sprite(
        -this.tankWidth / 2,
        -this.tankHeight / 2,
        "main",
        `${this.team}Tank0.png`
      )
      .setDisplaySize(this.tankWidth, this.tankHeight)
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
    this.setSize(this.tankWidth, this.tankHeight);
    this.scene.physics.world.enable(this);

    this.bubble = new Bubble(this.scene).setDepth(10000);

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
    // apply powerUp
    this.user.powerUps.forEach((powerUp) => {
      powerUp.applyUp(this.user as User);
    });
    this.loadFace();
    // this.levelText = this.scene.add
    //   .text(
    //     this.team === Team.Blue ? -4 : -10,
    //     -this.tankHeight / 2 - 4,
    //     `lv${this.level}`,
    //     {
    //       fontSize: "8px",
    //     }
    //   )
    //   .setOrigin(0);
    // this.add(this.levelText);
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
      duration: Math.min(this.rotateDuration, this.fullFireRotateDuration),
      loop: -1,
    };
    if (this.tween) {
      this.tween.remove();
    }
    this.tween = this.scene.tweens.add(tweenConfig);
  }

  onBulletOverlapsPlayer(bullet: Bullet, player: Player) {
    bullet.setDie();
    if (player.x > 16 && player.x < this.scene.renderer.width - 16) {
      player.getDamaged(this.power);
      if (player.isDie && this.user) {
        this.user.killCount += 1;
        this.user.xp += player.level * 2;
      }
      LeagueOfBarrage.Core.store.dispatch(updateUser());
    }
  }

  getDamaged(power: number = 1) {
    this.checkForLevelUp();
    this.checkForFullFire();
    if (this.receivingDamage) {
      this.hp -= power;
      if (this.isDie) {
        this.setDie();
      } else {
        this.onGetDamaged();
      }
    }
  }

  onGetDamaged() {
    if (this.receivingDamage) {
      this.tank.setTintFill(0xffffff);
      this.scene.time.addEvent({
        delay: 120,
        loop: false,
        callback: () => {
          this?.tank?.clearTint();
          this.receivingDamage = true;
        },
      });
      this.receivingDamage = false;
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

  checkForFullFire() {
    const minFullFireDelay = 200;
    // const minFullFireAmmo = 50;
    const minFullFireRotateDuration = 500;
    if (this.hp <= 3 && !this.isFullFire) {
      this.isFullFire = true;
      this.fullFireDelay = Math.min(minFullFireDelay, this.fireDelay);
      // this.fullFireAmmo = Math.max(minFullFireAmmo, this.ammo);
      this.fullFireRotateDuration = Math.min(
        minFullFireRotateDuration,
        this.rotateDuration
      );

      // this.bullets.maxSize = this.fullFireAmmo;
      this.makeTween();
      this.speak("???????????????");
      LeagueOfBarrage.Core.store.dispatch(updateUser());
    } else if (this.hp > 3 && this.isFullFire) {
      // ??????????????????
      this.isFullFire = false;
      this.fullFireDelay = this.fireDelay;
      this.fullFireRotateDuration = this.rotateDuration;
      // this.fullFireAmmo = this.ammo;
      // this.bullets.maxSize = this.ammo;
      this.makeTween();
      LeagueOfBarrage.Core.store.dispatch(updateUser());
    }
  }

  async loadFace() {
    if (!this.scene) return;
    const key = `${this.mid}-face`;
    // ????????????
    if (this.user.faceUrl) {
      this.makeFace(key);
    } else if (this.mid > 0) {
      // ???NPC
      const url = `/api/face/${this.mid}`;
      const response = await fetch(url);
      const data = await response.json();
      const faceUrl = data.face;
      if (faceUrl) {
        this.scene.load.image(key, faceUrl);
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
          this.user.faceUrl = faceUrl;
          LeagueOfBarrage.Core.store.dispatch(updateUser());
          this.makeFace.call(this, key);
        });
        this.scene.load.start();
      }
    }
  }

  makeFace(key: string) {
    this.face = new CircleMaskImage(
      this.scene,
      this.team === Team.Red ? -5 : 5,
      0,
      key
    );
    this.face.setDisplaySize(this.tankWidth - 24, this.tankHeight - 24);
    this.scene.add.existing(this.face);
    this.add(this.face);
  }

  setDie() {
    if (this.active) {
      this.hpBar.setDie();
      this.remove(this.bubble);
      this.bubble.destroy(true);
      this.setActive(false);
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
          // ??????
          if (this.user.life > 0) {
            LeagueOfBarrage.Core.makePlayer(this.user);
          }
          LeagueOfBarrage.Core.store.dispatch(updateUser());
        });
    }
  }

  levelUp() {
    this.level++;
    const powerUp = new PowerUp({
      hp: this.maxHp,
      maxHp: 1 * this.level,
      fireDelay: -20 * this.level,
      power: 0.1 * this.level,
      num: 1,
    });
    // this.levelText.setText(`lv${this.level}`);
    powerUp.applyUp(this.user as User);
    this.user.powerUps.push(powerUp);
    LeagueOfBarrage.Core.store.dispatch(updateUser());
  }

  checkForLevelUp() {
    let factor = 2 + 1.5 * Math.floor(this.level / 20);
    factor = Math.min(factor, 5);
    const requiredToLevelUp = factor * this.level * this.level;
    // console.log(this.user?.xp > 0);
    if (requiredToLevelUp <= this.user?.xp) {
      this.levelUp();
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
    if (
      this.x > 0 &&
      this.x < this.scene.renderer.width &&
      time > this.lastFired
    ) {
      const bullet: Bullet = this.bullets.get();
      if (bullet) {
        bullet.speed = this.bulletSpeed;
        bullet.fire(this, this.x, this.y);
        this.lastFired = time + Math.min(this.fireDelay, this.fullFireDelay);
      }
    }
  }
}
