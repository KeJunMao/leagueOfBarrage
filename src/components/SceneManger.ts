import Scenes from "../enums/Scenes";

export default class SceneManager {
  game: Phaser.Game;
  scene: Phaser.Scenes.ScenePlugin;
  constructor(game: Phaser.Game, scene: Phaser.Scenes.ScenePlugin) {
    this.game = game;
    this.scene = scene;
  }

  gameOver() {
    this.scene.pause(this.scene.get(Scenes.MainScene));
    this.scene.start(this.scene.get(Scenes.ScoreScene));
    // timeout 3000
    setTimeout(() => {
      this.scene.stop(this.scene.get(Scenes.ScoreScene));
      this.scene.restart(this.scene.get(Scenes.MainScene));
    }, 5000);
  }
}
