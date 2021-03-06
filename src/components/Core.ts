import { KeepLiveWS, LiveWS } from "bilibili-live-ws/src/browser";
import Toast from "phaser3-rex-plugins/templates/ui/toast/Toast";
import Team from "../enums/Team";
import { parseDANMU_MSG, parseSEND_GIFT } from "../utils/parseBilibili";
import AnimsManger from "./anims";
import { BlueFlag, Flag, RedFlag } from "./Flag";
import LeagueOfBarrage from "./LeagueOfBarrage";
import Player from "./Player";
import PowerUp, { facesPowerUp, giftsPowerUp } from "./PowerUp";
import SceneManager from "./SceneManger";
import ScoreBar from "./ScoreBar";
import { User } from "./User";
import throttle from "lodash.throttle";
import { store } from "../store";
import { addUser, clearUser } from "../store/usersSlice";

export default class Core {
  game: LeagueOfBarrage;
  scene: Phaser.Scene;
  redFlag!: Flag;
  blueFlag!: Flag;
  redPlayerGroup!: Phaser.GameObjects.Group;
  bluePlayerGroup!: Phaser.GameObjects.Group;
  live!: KeepLiveWS;
  animsManger!: AnimsManger;
  scoreBar!: ScoreBar;
  sceneManager!: SceneManager;
  testTimer: any;
  isGameOver = false;
  isGameStart = 5;
  // users: User[] = [];
  public winTeam: Team | null = null;
  toast!: Toast;
  sound!: Phaser.Sound.BaseSound;
  store = store;

  constructor(game: LeagueOfBarrage, scene: Phaser.Scene) {
    this.game = game;
    this.scene = scene;
    // this.live = new LiveWS(1439885);
    this.live = new KeepLiveWS(1439885);
    this.live.on("open", () => console.log("Connection is established"));
    // Connection is established
    this.live.on("live", () => {
      this.live.on("heartbeat", console.log);
      // 13928
    });
    this.live.on("DANMU_MSG", this.onDanmuMsg.bind(this));
    this.live.on("SEND_GIFT", this.onSendGift.bind(this));
    // this.makeFakeLive();
  }

  makeFakeLive() {
    const fakeLive = new LiveWS(24375803);
    fakeLive.on("live", () => {
      fakeLive.on("heartbeat", console.log);
      // 13928
    });
    fakeLive.on("DANMU_MSG", this.onDanmuMsg.bind(this));
    fakeLive.on("SEND_GIFT", this.onSendGift.bind(this));
  }

  cleanUp() {
    clearInterval(this.testTimer);
    this.redPlayerGroup.clear();
    this.bluePlayerGroup.clear();
    // this.users = [];
    this.store.dispatch(clearUser());
    this.isGameOver = false;
    this.isGameStart = 5;
  }

  initGame(scene: Phaser.Scene) {
    this.scene = scene;
    this.game.sound.removeAll();
    this.sound = this.game.sound.add("bg-music", {
      loop: true,
    });
    this.sound.play();
    this.toast = this.scene.rexUI.add.toast({
      x: this.scene.renderer.width / 2,
      y: this.scene.renderer.height - 12,
      text: this.scene.add.text(0, 0, "", {
        fontSize: "12px",
      }),
      duration: {
        hold: 500,
      },
    });
    this.animsManger = new AnimsManger(this.scene);
    this.redPlayerGroup = this.scene.add.group({
      runChildUpdate: true,
    });
    this.bluePlayerGroup = this.scene.add.group({
      runChildUpdate: true,
    });

    this.cleanUp();

    // this.makeMap();
    this.makeFlag();

    this.scene.physics.add.collider(
      this.redPlayerGroup,
      this.bluePlayerGroup,
      /// @ts-ignore
      this.onRedPlayerOverlapsBluePlayer
    );
    this.scene.physics.add.collider(this.bluePlayerGroup, this.bluePlayerGroup);
    this.scene.physics.add.collider(this.redPlayerGroup, this.redPlayerGroup);
    this.scene.physics.add.overlap(
      this.redFlag,
      this.bluePlayerGroup,
      /// @ts-ignore
      this.onFlagOverlapsPlayer.bind(this)
    );
    this.scene.physics.add.overlap(
      this.blueFlag,
      this.redPlayerGroup,
      /// @ts-ignore
      this.onFlagOverlapsPlayer.bind(this)
    );

    this.scoreBar = new ScoreBar(this.scene);
    const timer = this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.isGameStart !== -1) return;
        this._makeNpc();
        const { users } = this.store.getState();
        if (users.value.length >= 6) {
          timer.paused = true;
        }
      },
    });
  }

  onDanmuMsg(data: any) {
    if (this.isGameOver) return;
    const danmu = parseDANMU_MSG(data);
    const hasUser = User.getUserByMid(danmu.mid);
    if (!hasUser) {
      if (danmu.text === "???" || danmu.text === "???") {
        const team = danmu.text === "???" ? Team.Red : Team.Blue;
        const user = new User(danmu.mid, team, danmu.name);
        // this.users.push(user);
        this.store.dispatch(addUser(user));
        this.makePlayer(user);
      } else {
        const user = this.makeRandomUser(danmu.mid, danmu.name);
        this.makePlayer(user);
      }
    } else {
      if (danmu.faceId) {
        const powerUpFunc = facesPowerUp[danmu.faceId];
        if (powerUpFunc) {
          const powerUp = powerUpFunc(hasUser);
          powerUp.applyUpOnce(hasUser);
          if (powerUp.text) {
            hasUser.speak(powerUp.text);
          }
        }
      } else {
        hasUser?.speak(danmu.text);
      }
      // ?????????
      // this.makeGift(hasUser, danmu.text);
    }
  }

  makeGift(user: User, cmd: string) {
    if (cmd.startsWith(":")) {
      let [giftIdStr, numStr] = cmd.split(":")[1].split("-");
      const giftId = parseInt(giftIdStr);
      const num = parseInt(numStr) > 100 ? 100 : parseInt(numStr);
      if ([1, 31037, 31036, 30607].includes(giftId)) {
        this.onSendGift({
          data: {
            giftId,
            giftName: "????????????",
            num,
            uid: user.mid,
            uname: user.name,
          },
        });
      }
    }
  }

  makeRandomUser(mid: number, name: string) {
    let user = User.getUserByMid(mid);
    let team = Math.random() > 0.5 ? Team.Red : Team.Blue;
    if (
      this.bluePlayerGroup?.children.size > this.redPlayerGroup?.children.size
    ) {
      team = Team.Red;
    } else if (
      this.bluePlayerGroup?.children.size < this.redPlayerGroup?.children.size
    ) {
      team = Team.Blue;
    }
    if (!user) {
      user = new User(mid, team, name);
      this.store.dispatch(addUser(user));
    }
    return user;
  }

  onSendGift(data: any) {
    if (this.isGameOver) return;
    const gift = parseSEND_GIFT(data);
    // console.log(gift);
    let user = User.getUserByMid(gift.mid);
    const powerUpFunc = giftsPowerUp[gift.id];
    // ????????????????????????????????????
    let powerUp: PowerUp = new PowerUp({
      life: gift.num,
    });
    if (powerUpFunc) {
      powerUp = powerUpFunc(gift.num);
    }
    // ?????????????????????????????????????????????
    if (!user) {
      user = this.makeRandomUser(gift.mid, gift.uname);
      user.powerUps.push(powerUp);
      this.makePlayer(user);
    } else {
      user.powerUps.push(powerUp);
      powerUp.applyUp(user);
    }
    if (powerUp.text) {
      user.speak(powerUp.text);
      this.toast.showMessage(`${user.name}?????????${powerUp.text}`);
    }
  }

  // onRedPlayerOverlapsBluePlayer(red: Player, blue: Player) {}
  onFlagOverlapsPlayer(flag: Flag, player: Player) {
    if (flag.team !== player.team) {
      // alert(`${player.team} win!`);
      this.winTeam = player.team;
      this.isGameOver = true;
      LeagueOfBarrage.Core.sceneManager.gameOver();
    }
  }
  makeMap() {
    var tiles = [7, 7, 7, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5];

    var mapData = [];

    for (var y = 0; y < this.scene.renderer.height / 16; y++) {
      var row = [];

      for (var x = 0; x < this.scene.renderer.width / 16; x++) {
        var tileIndex = Phaser.Math.RND.weightedPick(tiles);

        row.push(tileIndex);
      }

      mapData.push(row);
    }

    var map = this.scene.make.tilemap({
      data: mapData,
      tileWidth: 16,
      tileHeight: 16,
    });
    var tileset = map.addTilesetImage("tiles");
    map.createLayer(0, tileset, 0, 0);
  }

  makePlayer(user: User) {
    const xOffset = -50;
    const yOffset = 30;
    const player = new Player(
      this.scene,
      xOffset,
      Math.random() * (this.scene.renderer.height - yOffset * 2) + yOffset,
      user
    );
    if (user.team === Team.Red) {
      this.redPlayerGroup.add(player);
    } else {
      player.setX(this.scene.renderer.width - xOffset);
      this.bluePlayerGroup.add(player);
    }
    return player;
  }

  makeFlag() {
    const xOffset = 50;
    this.redFlag = new RedFlag(
      this.scene,
      xOffset,
      (this.scene.renderer.height as number) / 2
    );
    this.blueFlag = new BlueFlag(
      this.scene,
      (this.scene.renderer.width as number) - xOffset,
      (this.scene.renderer.height as number) / 2
    );
  }

  private _makeNpc() {
    const { users } = this.store.getState();
    const npcList = [
      {
        mid: 1526202214,
        name: "???????????????7",
      },
      {
        mid: 17329503,
        name: "LxShann",
      },
      {
        mid: 1643473462,
        name: "Too-Ln",
      },
      {
        mid: 77236988,
        name: "???????????????",
      },
      {
        mid: 2122373318,
        name: "?????????",
      },
      {
        mid: 37728693,
        name: "Ke Jun",
      },
    ];
    const npcUser = npcList[users.value.length];
    if (npcUser) {
      const npc = this.makeRandomUser(npcUser.mid, npcUser.name);
      npc.powerUps.push(
        new PowerUp({
          power: -1,
          maxHp: -2,
        })
      );
      if (!npc.player) {
        this.makePlayer(npc);
      }
    }
  }

  update(_time: number = 0) {
    // this.makeNpc();
    this.scoreBar.update();
  }
}
