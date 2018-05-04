/// <reference path="../node_modules/@types/pixi.js/index.d.ts" />
import "pixi.js";
import { ColorUtils } from "./colors"

class BlobShape {
  radius: number = 10;
  radialData: Array<number>;
  color: Array<number>;
  render(shape: PIXI.Graphics): void {
    shape.clear();
    shape.beginFill(PIXI.utils.rgb2hex(ColorUtils.hslToRgb(this.color[0], this.color[1], this.color[2])));
    shape.lineStyle(4, PIXI.utils.rgb2hex(ColorUtils.hslToRgb(this.color[0], this.color[1], this.color[2])));

    //Use `drawPolygon` to define the triangle as
    //a path array of x/y positions
    var points = [];
    for (var i = 0; i < this.radialData.length; i++) {
      var angle = Math.PI * i / this.radialData.length * 2;
      var x = Math.cos(angle) * this.radialData[i];
      var y = Math.sin(angle) * this.radialData[i];
      points.push(x);
      points.push(y);
    }

    shape.drawPolygon(points);

    //Fill shape's color
    shape.endFill();
    shape.closePath();
  }
  renderCircle(shape: PIXI.Graphics): void {
    shape.clear();
    shape.beginFill(PIXI.utils.rgb2hex(ColorUtils.hslToRgb(this.color[0], this.color[1], this.color[2])));
    shape.lineStyle(6, PIXI.utils.rgb2hex(ColorUtils.hslToRgb(this.color[0], this.color[1] / 87 * 76, this.color[2] / 55 * 49)));


    shape.drawCircle(0, 0, this.radius);

    //Fill shape's color
    shape.endFill();
    shape.closePath();
  }
  sampleRadius(angle: number): number {
    var l = angle / Math.PI * this.radialData.length / 2;
    var Le = l - Math.floor(l);
    var A = (Math.floor(l) % this.radialData.length + this.radialData.length) % this.radialData.length;
    var B = (Math.ceil(l) % this.radialData.length + this.radialData.length) % this.radialData.length;
    return this.radialData[A] * (1 - Le) + this.radialData[B] * (Le);

  }
  smooth(power: number): void {
    var newData = [];
    for (var i = 0; i < this.radialData.length; i++) {
      newData[i] = Math.pow((Math.pow(this.radialData[(i + 1) % this.radialData.length], 2) * power / 2 + Math.pow(this.radialData[i], 2) * (1 - power) + Math.pow(this.radialData[(i + this.radialData.length - 1) % this.radialData.length], 2) * power / 2), 0.5);
    }
    this.radialData = newData;
  }
  ave(power: number): void {
    var totEdge = 0;
    for (var i = 0; i < this.radialData.length; i++) {
      totEdge += Math.pow(this.radialData[i], 2) / this.radialData.length / this.radius / this.radius;
    }
    var newData = [];
    for (var i = 0; i < this.radialData.length; i++) {
      newData[i] = this.radialData[i] + (1 - power) * (1 - totEdge) * this.radius + (Math.random() - 0.5) * (1 - power) * 0.1;
    }
    this.radialData = newData;
  }
  wall(angle: number, dist: number, power: number): void {
    //var newData=[];

    for (var i = 0; i < this.radialData.length; i++) {
      var radAngle = Math.PI * i / this.radialData.length * 2;
      var comp = Math.cos(angle - radAngle);
      if (dist < this.radialData[i] * comp) {
        var l = 1 - power;
        this.radialData[i] = this.radialData[i] * l + dist / comp * (1 - l);//dist/comp;
      }
    }
    //this.radialData=newData;
  }
  constructor(radius: number, color: Array<number>) {
    this.radius = radius;
    this.color = color;
    this.radialData = [];
    for (var i = 0; i < this.radius * 4; i++) {
      this.radialData.push((Math.random() - 0.5) * 10 + this.radius);
    }
  };
}
export { BlobShape };
