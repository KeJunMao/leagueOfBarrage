import { updateUser } from "../store/usersSlice";
import LeagueOfBarrage from "./LeagueOfBarrage";
import Player from "./Player";
// import Player from "./Player";
import { User } from "./User";

interface IPowerUpProps {
  power?: number;
  fireDelay?: number;
  speed?: number;
  hp?: number;
  maxHp?: number;
  area?: number;
  life?: number;
  text?: string;
  bulletSpeed?: number;
  num?: number;
  rotateDuration?: number;
}
export default class PowerUp {
  public power = 0;
  public fireDelay = 0;
  public speed = 0;
  public hp = 0;
  public maxHp = 0;
  public area = 0;
  public life = 0;
  public text = "";
  public bulletSpeed = 0;
  public num = 1;
  public rotateDuration = 0;
  constructor({
    power,
    fireDelay,
    speed,
    hp,
    maxHp,
    area,
    life,
    text,
    bulletSpeed,
    num,
    rotateDuration,
  }: IPowerUpProps) {
    this.power = power ?? 0;
    this.fireDelay = fireDelay ?? 0;
    this.speed = speed ?? 0;
    this.hp = hp ?? 0;
    this.maxHp = maxHp ?? 0;
    this.area = area ?? 0;
    this.text = text ?? "";
    this.bulletSpeed = bulletSpeed ?? 0;
    this.num = num ?? 1;
    this.life = life ?? 0;
    this.rotateDuration = rotateDuration ?? 0;
  }

  valueByNum(val: number) {
    return val * this.num;
  }

  get Power() {
    return this.valueByNum(this.power);
  }

  get Speed() {
    return this.valueByNum(this.speed);
  }

  get FireDelay() {
    return this.valueByNum(this.fireDelay);
  }

  get Hp() {
    return this.valueByNum(this.hp);
  }
  get MaxHp() {
    return this.valueByNum(this.maxHp);
  }

  get BulletSpeed() {
    return this.valueByNum(this.bulletSpeed);
  }
  get Area() {
    return this.valueByNum(this.area);
  }

  get RotateDuration() {
    return this.valueByNum(this.rotateDuration);
  }

  applyFireDelay(player: Player) {
    if (this.fireDelay > 0) {
      for (let i = 0; i < this.num; i++) {
        const factor =
          (player.fireDelay * this.fireDelay) / Math.log(player.fireDelay);
        player.fireDelay = Math.min(factor, player.fireDelay);
      }
      // ???????????????
    } else if (this.fireDelay < 0) {
      player.fireDelay += this.fireDelay * this.num;
    }
  }

  applyUp(user: User) {
    if (!user) return;
    const player = user.player;

    // ??????
    if (player && !player?.isDie) {
      player.power += this.Power;
      this.applyFireDelay(player);

      // player.fireDelay -= this.FireDelay;
      // // ????????????
      if (player.fireDelay < 50) {
        player.fireDelay = 50;
      }
      player.speed += this.Speed;

      player.bulletSpeed += this.BulletSpeed;

      player.hp += this.Hp;
      player.maxHp += this.MaxHp;

      if (player.hp > player.maxHp) {
        player.hp = Math.max(player.maxHp, 1);
      }

      if (this.Area || this.RotateDuration) {
        player.area += this.Area;

        player.rotateDuration -= this.RotateDuration;
        // ????????????????????????200
        if (player.rotateDuration < 200) {
          player.rotateDuration = 200;
        }
        player.makeTween();
      }

      // ??????????????????
      if (this.life > 0) {
        user.life += this.life;
        this.life = 0;
        LeagueOfBarrage.Core.store.dispatch(updateUser());
      }
      // ???????????????????????????
    } else {
      // ????????????????????????
      if (this.life > 0) {
        user.life += this.life;
        this.life = 0;
        if (user.life > 0 && user.player?.isDie) {
          console.log("????????????");
          LeagueOfBarrage.Core.makePlayer(user);
          this.applyUp(user);
        }
        LeagueOfBarrage.Core.store.dispatch(updateUser());
      } else {
        this.life = 0;
        console.log(user.life);
        console.log("??????????????????");
      }
    }
  }

  applyUpOnce(user: User) {
    if (user.powerUps.includes(this)) {
      user.powerUps.slice(user.powerUps.indexOf(this), 1);
    }
    this.applyUp(user);
  }
}

// ?????? ???????????? ????????????
const laTiaoGift = (num: number = 1) => {
  return new PowerUp({
    text: `??????????????????*${num}`,
    fireDelay: 3,
    hp: 5,
    life: num,
    num,
  });
};
// ????????? ???????????? ???????????? ??????????????????
// const heartGift = (num: number = 1) => {
//   return new PowerUp({
//     text: `?????????????????????*${num}`,
//     fireDelay: 200,
//     life: num,
//     num,
//   });
// };

// ????????? ???????????????????????????????????????????????????
const flowerGift = (num: number = 1) => {
  return new PowerUp({
    text: `?????????????????????*${num}`,
    fireDelay: 1.5,
    speed: 0.05,
    area: 0.1 / 5,
    life: num,
    bulletSpeed: 0.1 / 5,
    num,
  });
};

// ??? call ??????????????????
const callGift = (num: number = 1) => {
  return new PowerUp({
    text: `???call????????????*${num}`,
    fireDelay: 0.76,
    speed: 1,
    area: 1,
    life: num,
    bulletSpeed: 0.1,
    num,
  });
};

export const giftsPowerUp: {
  [key: number | string]: (num?: number) => PowerUp;
} = {
  // ??????
  1: laTiaoGift,
  // da call
  31037: callGift,
  // ?????????
  31036: flowerGift,
  // // ?????????
  // 30607: heartGift,
};

export const facesPowerUp: {
  [key: string]: (user?: User) => PowerUp;
} = {
  // ??????
  official_147: () => {
    return new PowerUp({
      hp: 1,
      text: "????????????*1",
    });
  },
  // ???call
  official_146: (user?: User) => {
    const rand = Math.random();
    let powerUp = new PowerUp({});
    if (!user) return powerUp;
    if (rand <= 0.5) {
      // ?????????
      powerUp.hp -= 1;
      powerUp.text = "???call????????????";
    } else {
      powerUp = callGift();
      powerUp.fireDelay = 7;
      powerUp.hp = 0;
      powerUp.life = 0;
      powerUp.text = "????????call????????????*1";
    }
    return powerUp;
  },
  // ??????
  official_103: (user?: User) => {
    if (user && user?.life <= 0 && user.player?.isDie) {
      return new PowerUp({
        life: 1,
        text: "????????????",
      });
    }
    return new PowerUp({});
  },
};
