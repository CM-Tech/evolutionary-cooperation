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
  constructor(width: number, height: number, container: PIXI.Container) {
    this.width = width;
    this.height = height;
    this.container = container;
    this.background = new PIXI.Graphics();
    this.background.lineStyle(2, PIXI.utils.rgb2hex(ColorUtils.hslToRgb(195 / 360, 11 / 100, 79 / 100)));
    this.background.drawRect(0, 0, width, height);
    this.container.addChild(this.background);
    for (var i = 0; i < 10; i++) {
      var animal = new Animal();
      animal.color = [Math.random(), 87 / 100, 54 / 100];
      animal.radius = 20 + Math.random() * 10;
      animal.position = new Vector(Math.random() * (this.width - 20 * 2) + 20, Math.random() * (this.height - 20 * 2) + 20);
      animal.velocity = new Vector(Math.random() - 0.5, Math.random() - 0.5).normalize().scale(0.1);
      this.container.addChild(animal.shape);
      this.animals.push(animal);
    }

  };
  render(delta: number) {
    this.animals.map(x => x.render());
    for (var i = 0; i < this.animals.length; i++) {
      this.animals[i].velocity = this.animals[i].velocity.normalize();
      var ang = Math.random() * Math.PI * 2;
      this.animals[i].velocity = new Vector(this.animals[i].velocity.x + (Math.cos(ang)) * delta / 10000, this.animals[i].velocity.y + (Math.sin(ang)) * delta / 10000).normalize().scale(0.2);
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
