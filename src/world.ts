/// <reference path="../node_modules/@types/pixi.js/index.d.ts" />
import "pixi.js";
import { Animal } from "./animal";
import { ColorUtils } from "./colors";
import { Vector } from "./vector";

class World {
  width: number;
  height: number;
  container: PIXI.Container;
  animals: Array<Animal> = [];
  background: PIXI.Graphics;
  bkSprite: PIXI.extras.TilingSprite;
  constructor(width: number, height: number, container: PIXI.Container) {
    this.width = width;
    this.height = height;
    this.container = container;
    this.background = new PIXI.Graphics();
    this.background.lineStyle(2, PIXI.utils.rgb2hex(ColorUtils.hslToRgb(195 / 360, 11 / 100, 79 / 100)));
    this.background.drawRect(0, 0, width, height);
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
    this.bkSprite = new PIXI.extras.TilingSprite(
      bkTex,
      this.width,
      this.height
    );
    this.container.addChild(this.bkSprite);
    //this.container.addChild(this.background);
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var animal = new Animal([], { radius: 25 + Math.random() * 50 });
        animal.color = [Math.floor(Math.random() * 6) / 6, 87 / 100, 54 / 100];
        //animal.color = [(i % 6) / 6, 87 / 100, 54 / 100];
        animal.position = new Vector(i / 4 * (this.width - 20 * 2) + 20, j / 4 * (this.height - 20 * 2) + 20);
        animal.velocity = new Vector(Math.random() - 0.5, Math.random() - 0.5).normalize().scale(0.1);
        this.container.addChild(animal.shape);
        this.animals.push(animal);
      }
    }

  };
  render(delta: number) {
    var l = 1 - Math.pow(0.9, (delta));
    var l2 = 1 - Math.pow(0.9, (delta) / 10);
    this.animals.map(x => x.render());
    for (var i = 0; i < this.animals.length; i++) {
      this.animals[i].blob.smooth(l);
      this.animals[i].blob.ave(l);
    }
    for (var i = 0; i < this.animals.length; i++) {
      this.animals[i].force = new Vector(0, 0);
      for (var j = 0; j < i; j++) {
        var posA = this.animals[i].position;
        var posB = this.animals[j].position;
        var deltaV = new Vector(posB.x - posA.x, posB.y - posA.y);
        var len = deltaV.length();
        if (deltaV.length() < this.animals[i].radius + this.animals[j].radius) {
          var lenq = -deltaV.length() + (this.animals[i].radius + this.animals[j].radius);
          var normDelta = deltaV.normalize();
          this.animals[i].force = this.animals[i].force.add(normDelta.scale(-0.0001 * delta * lenq));
          this.animals[j].force = this.animals[j].force.add(normDelta.scale(0.0001 * delta * lenq));
          this.animals[i].blob.wall(Math.atan2(deltaV.y, deltaV.x), deltaV.length() / (this.animals[i].radius + this.animals[j].radius) * (this.animals[i].radius), l2);
          this.animals[j].blob.wall(Math.atan2(-deltaV.y, -deltaV.x), deltaV.length() / (this.animals[i].radius + this.animals[j].radius) * (this.animals[j].radius), l2);
        }
      }
    }
    for (var i = 0; i < this.animals.length; i++) {
      this.animals[i].velocity = this.animals[i].velocity.add(this.animals[i].force);
      this.animals[i].velocity = this.animals[i].velocity.normalize().scale(0.2);
      /*this.animals[i].velocity = this.animals[i].velocity.normalize()
      var ang = Math.random() * Math.PI * 2;
      this.animals[i].velocity = new Vector(this.animals[i].velocity.x + (Math.cos(ang)) * delta / 1000, this.animals[i].velocity.y + (Math.sin(ang)) * delta / 1000).normalize().scale(0.2);
      */
      this.animals[i].position.x += this.animals[i].velocity.x * delta;
      this.animals[i].position.y += this.animals[i].velocity.y * delta;
      if (this.animals[i].position.x < this.animals[i].radius) {
        this.animals[i].position.x = this.animals[i].radius;
        this.animals[i].velocity.x = Math.abs(this.animals[i].velocity.x);
      }
      if (this.animals[i].position.y < this.animals[i].radius) {
        this.animals[i].position.y = this.animals[i].radius;
        this.animals[i].velocity.y = Math.abs(this.animals[i].velocity.y);
      }
      if (this.width - this.animals[i].position.x < this.animals[i].radius) {
        this.animals[i].position.x = this.width - this.animals[i].radius;
        this.animals[i].velocity.x = -Math.abs(this.animals[i].velocity.x);
      }
      if (this.height - this.animals[i].position.y < this.animals[i].radius) {
        this.animals[i].position.y = this.height - this.animals[i].radius;
        this.animals[i].velocity.y = -Math.abs(this.animals[i].velocity.y);
      }
    }
  }

}
export { World };
