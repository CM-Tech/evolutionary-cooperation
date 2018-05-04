/// <reference path="../node_modules/@types/pixi.js/index.d.ts" />
import "pixi.js";
import { BlobShape } from "./blob";
import { ColorUtils } from "./colors";
import { Animal } from "./animal";
import { World } from "./world";
//Create a Pixi Application
var size = { width: 800, height: 800 };
let app = new PIXI.Application({ width: 256, height: 256, antialias: true });
app.renderer.autoResize = true;
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
window.onresize = function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  bkSprite.width = window.innerWidth;
  bkSprite.height = window.innerHeight;
}
var bk = PIXI.utils.rgb2hex(ColorUtils.hslToRgb(198 / 360, 100 / 100, 97 / 100));
var bk2 = PIXI.utils.rgb2hex(ColorUtils.hslToRgb(195 / 360, 11 / 100, 79 / 100));
var bkSize = 40;
var bkGrid = new PIXI.Graphics();
bkGrid.beginFill(bk);
bkGrid.drawRect(0, 0, bkSize, bkSize);
bkGrid.endFill();
bkGrid.beginFill(bk2);
bkGrid.drawRect(0, 0, 1, bkSize);
bkGrid.endFill();
bkGrid.beginFill(bk2);
bkGrid.drawRect(0, 0, bkSize, 1);
bkGrid.endFill();
var bkTex = bkGrid.generateCanvasTexture();
var bkSprite = new PIXI.extras.TilingSprite(
  bkTex,
  app.screen.width,
  app.screen.height
);
app.stage.addChild(bkSprite);
var blob: BlobShape = new BlobShape(100, [356 / 360, 87 / 100, 54 / 100]);
var blob2: BlobShape = new BlobShape(100, [196 / 360, 87 / 100, 54 / 100]);
let triangle = new PIXI.Graphics();
let triangle2 = new PIXI.Graphics();
var worldContainer = new PIXI.Container();
app.stage.addChild(worldContainer);
var world: World = new World(size.width, size.height, worldContainer);
//blob.renderCircle(triangle);
//blob2.renderCircle(triangle2);
//Position the triangle after you've drawn it.
//The triangle's x/y position is anchored to its first point in the path


//app.stage.addChild(triangle);
//app.stage.addChild(triangle2);

var lastTick = new Date().getTime();
window.setInterval(function() {
  var newLastTick = new Date().getTime();
  world.render(newLastTick - lastTick);
  var l = 1 - Math.pow(0.9, (newLastTick - lastTick) / 10);
  blob.radius = Math.cos(newLastTick / 1000) * 25 + 75;
  //blob.renderCircle(triangle);
  //blob2.renderCircle(triangle2);

  lastTick = newLastTick;
  var radius = Math.min(window.innerWidth, window.innerHeight);
  var angle = new Date().getTime() / 1000;
  worldContainer.x = window.innerWidth / 2 - world.width / 2;
  worldContainer.y = window.innerHeight / 2 - world.height / 2;
  /*triangle.x = window.innerWidth / 2;
  triangle.y = window.innerHeight / 2;
  triangle2.x = window.innerWidth / 2 + radius / 4 * Math.cos(angle);
  triangle2.y = window.innerHeight / 2 + radius / 4 * Math.sin(angle);*/
}, 10);
