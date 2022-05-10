import Player from "./Player";

export default class PowerUp {
  public power = 0;
  public fireDelay = 0;
  public speed = 0;
  public hp = 0;
  public maxhp = 0;
  public ammo = 0;
  public area = 0;
  constructor({ power, fireDelay, speed, hp, maxHp, ammo, area }: any) {
    this.power = power;
    this.fireDelay = fireDelay;
    this.speed = speed;
    this.hp = hp;
    this.maxhp = maxHp;
    this.ammo = ammo;
    this.area = area;
  }

  applyUp(player: Player) {
    player.power += this.power;
    player.fireDelay -= this.fireDelay;
    player.speed += this.speed;
    player.hp += this.hp;

    const hp = player.maxHp;
    player.maxHp += this.maxhp;
    player.hp += this.maxhp - hp;

    player.ammo += this.ammo;

    player.bullets.maxSize = player.ammo;

    player.area += this.area;
    player.makeTween();
  }
}

// 辣条
const laTiaoGift = () => {
  return new PowerUp({});
};

export const gifts: {
  [key: number]: PowerUp;
} = {
  // 辣条
  1: laTiaoGift(),
};
