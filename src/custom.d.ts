import htm from "htm";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import LeagueOfBarrage from "./components/LeagueOfBarrage";
declare module "phaser" {
  interface Scene {
    rexUI: RexUIPlugin;
  }
}
declare global {
  var game: LeagueOfBarrage;
}
