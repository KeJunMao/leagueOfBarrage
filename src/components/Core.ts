import { LiveWS } from "bilibili-live-ws/src/browser";
import Toast from "phaser3-rex-plugins/templates/ui/toast/Toast";
import Team from "../enums/Team";
import { parseANMU_MSG, parseSEND_GIFT } from "../utils/parseBilibili";
import AnimsManger from "./anims";
import { BlueFlag, Flag, RedFlag } from "./Flag";
import LeagueOfBarrage from "./LeagueOfBarrage";
import Player from "./Player";
import { gifts } from "./PowerUp";
import SceneManager from "./SceneManger";
import ScoreBar from "./ScoreBar";
import { User } from "./User";

export default class Core {
  game: LeagueOfBarrage;
  scene: Phaser.Scene;
  redFlag!: Flag;
  blueFlag!: Flag;
  redPlayerGroup!: Phaser.GameObjects.Group;
  bluePlayerGroup!: Phaser.GameObjects.Group;
  live!: LiveWS;
  animsManger!: AnimsManger;
  scoreBar!: ScoreBar;
  sceneManager!: SceneManager;
  testTimer: any;
  isGameOver = false;
  isGameStart = 5;
  users: User[] = [];
  public winTeam: Team | null = null;
  toast!: Toast;

  constructor(game: LeagueOfBarrage, scene: Phaser.Scene) {
    this.game = game;
    this.scene = scene;
    this.live = new LiveWS(1439885);
    this.live.on("open", () => console.log("Connection is established"));
    // Connection is established
    this.live.on("live", () => {
      this.live.on("heartbeat", console.log);
      // 13928
    });
    this.live.on("DANMU_MSG", this.onDanmuMsg.bind(this));
    this.live.on("SEND_GIFT", (data) => {
      parseSEND_GIFT(data);
    });
  }

  cleanUp() {
    clearInterval(this.testTimer);
    this.redPlayerGroup.clear();
    this.bluePlayerGroup.clear();
    this.users = [];
    this.isGameOver = false;
    this.isGameStart = 5;
  }

  initGame(scene: Phaser.Scene) {
    this.scene = scene;
    this.toast = this.scene.rexUI.add.toast({
      x: this.scene.renderer.width / 2,
      y: this.scene.renderer.height - 12,
      text: this.scene.add.text(0, 0, "", {
        fontSize: "12px",
      }),
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

    /// @ts-ignore
    window.debug = () => {
      this.users.push(new User(37728693, Team.Red, "玩家1"));
      this.users.push(new User(2122373318, Team.Blue, "玩家2"));
      this.users.push(new User(37728693, Team.Red, "玩家3"));
      this.users.push(new User(2122373318, Team.Blue, "玩家4"));
      this.users.push(new User(37728693, Team.Red, "玩家5"));
      this.users.push(new User(2122373318, Team.Blue, "玩家6"));
      this.users.push(new User(2122373318, Team.Blue, "玩家7"));
      this.users.forEach((user) => {
        user.killCount = Math.floor(Math.random() * 10) + 1;
        this.makePlayer(user);
      });
    };
    /// @ts-ignore
    window.debug();

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
  }

  onDanmuMsg(data: any) {
    if (this.isGameOver) return;
    const danmu = parseANMU_MSG(data);
    const hasUser = User.getUserByMid(danmu.mid);
    if (danmu.text === "蓝" || danmu.text === "红") {
      const team = danmu.text === "红" ? Team.Red : Team.Blue;
      if (!hasUser) {
        const user = new User(danmu.mid, team, danmu.name);
        this.users.push(user);
        this.makePlayer(user);
      }
    } else {
      hasUser?.speak(danmu.text);
    }
  }

  onSendGift(data: any) {
    if (this.isGameOver) return;
    const gift = parseSEND_GIFT(data);
    const user = User.getUserByMid(gift.mid);
    if (user) {
      const powerUp = gifts[gift.id];
      if (powerUp) {
        powerUp.applyUp(user.player);
      }
    }
    // 如果用户已经存在，则强化
    // 不同礼物对应不同强化
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

  update() {
    this.scoreBar.update();
  }
}
