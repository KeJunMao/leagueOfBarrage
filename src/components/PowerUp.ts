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
        player.fireDelay = factor;
      }
      // 负数直接减
    } else if (this.fireDelay < 0) {
      player.fireDelay += this.fireDelay * this.num;
    }
  }

  applyUp(user: User) {
    const player = user.player;

    if (player) {
      player.power += this.Power;
      this.applyFireDelay(player);

      // player.fireDelay -= this.FireDelay;
      // // 限制射速
      if (player.fireDelay < 50) {
        player.fireDelay = 50;
      }
      player.speed += this.Speed;

      player.bulletSpeed += this.BulletSpeed;

      player.hp += this.Hp;
      player.maxHp += this.MaxHp;

      if (player.hp > player.maxHp) {
        player.hp = player.maxHp;
      }

      if (this.Area || this.RotateDuration) {
        player.area += this.Area;

        player.rotateDuration -= this.RotateDuration;
        // 限制选择速率最小200
        if (player.rotateDuration < 200) {
          player.rotateDuration = 200;
        }
        player.makeTween();
      }

      if (this.life > 0) {
        user.life += this.life;
        this.life = 0;
        LeagueOfBarrage.Core.store.dispatch(updateUser());
      }
    } else {
      if (this.life > 0) {
        user.life += this.life;
        this.life = 0;
        if (user.life > 0 && !user.player) {
          console.log("礼物复活");
          LeagueOfBarrage.Core.makePlayer(user);
          this.applyUp(user);
        }
        LeagueOfBarrage.Core.store.dispatch(updateUser());
      } else {
        console.log(user.life);
        console.log("阵亡无法强化");
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

// 辣条 提升射速 恢复血量
const laTiaoGift = (num: number = 1) => {
  return new PowerUp({
    text: `辣条低级强化*${num}`,
    fireDelay: 3,
    hp: 5,
    life: num,
    num,
  });
};
// 小心心 提升射速 恢复血量 提升血量上限
// const heartGift = (num: number = 1) => {
//   return new PowerUp({
//     text: `小心心中级强化*${num}`,
//     fireDelay: 200,
//     life: num,
//     num,
//   });
// };

// 小花花 提升射速、移动速度、角度、子弹速度
const flowerGift = (num: number = 1) => {
  return new PowerUp({
    text: `小花花高级强化*${num}`,
    fireDelay: 1.5,
    speed: 0.05,
    area: 0.1 / 5,
    life: num,
    bulletSpeed: 0.1 / 5,
    num,
  });
};

// 打 call 属性大幅提升
const callGift = (num: number = 1) => {
  return new PowerUp({
    text: `打call超级强化*${num}`,
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
  // 辣条
  1: laTiaoGift,
  // da call
  31037: callGift,
  // 小花花
  31036: flowerGift,
  // // 小心心
  // 30607: heartGift,
};

export const facesPowerUp: {
  [key: string]: (user?: User) => PowerUp;
} = {
  // 点赞
  official_147: () => {
    return new PowerUp({
      hp: 1,
      text: "血量恢复*1",
    });
  },
  // 打call
  official_146: (user?: User) => {
    const rand = Math.random();
    let powerUp = new PowerUp({});
    if (!user) return powerUp;
    if (rand > 0 && rand <= 0.25) {
      // 无事发生
      powerUp.text = "打call无事发生*1";
    } else if (rand > 0.25 && rand <= 0.5) {
      // 扣属性
      powerUp.hp -= 1;
      powerUp.text = "打call用力过猛";
    } else {
      powerUp = callGift();
      powerUp.fireDelay = 3;
      powerUp.text = "伪·打call超级强化*1";
    }
    return powerUp;
  },
  // 泪目
  official_103: (user?: User) => {
    if (user && user?.life <= 0 && !user.player) {
      return new PowerUp({
        life: 1,
        text: "立即复活",
      });
    }
    return new PowerUp({});
  },
};
