import * as neataptic from "neataptic";
import { ColorUtils } from "./colors";
import { Vector } from "./vector";
var architect = neataptic.architect;
var Network = neataptic.Network;
var methods = neataptic.methods;



class Animal {
  roundMemory: number;
  fitness: number;
  brain: any;
  position: Vector = new Vector(0, 0);
  velocity: Vector = new Vector(0, 0);
  force: Vector = new Vector(0, 0);
  radius: number = 20;
  color: Array<number>;
  shape: PIXI.Graphics;
  constructor(parents?: Array<Animal>, options?: { roundMemory: any; }) {
    this.roundMemory = 8;
    this.fitness = 0;
    var mutRate = 3;
    if (options) {
      if (options.roundMemory) this.roundMemory = options.roundMemory;
    }
    if (parents && parents.length > 1) {
      this.brain = Network.crossOver(parents[0].brain, parents[1].brain);
      for (var i = 0; i < mutRate; i++) {
        this.brain.mutate(methods.mutation.ALL);
      }
    } else {
      this.brain = architect.Random(this.roundMemory * 2, 2, this.roundMemory * 2 + 2); //this.brain = architect.Perceptron(this.roundMemory * 2,this.roundMemory * 2+ 2, 2);//architect.Random(this.roundMemory * 2, 2, 4);
      //this.brain.mutate(methods.mutation.ALL);
    }
    this.shape = new PIXI.Graphics();
  }
  choice(rounds: Array<number>): number {
    var res = this.brain.activate(rounds);
    if (res[0] > res[1]) {
      return 0;
    }
    return 1;
  }
  render(): void {
    var shape = this.shape;
    shape.clear();
    shape.beginFill(PIXI.utils.rgb2hex(ColorUtils.hslToRgb(this.color[0], this.color[1], this.color[2])));
    shape.lineStyle(6, PIXI.utils.rgb2hex(ColorUtils.hslToRgb(this.color[0], this.color[1] / 87 * 76, this.color[2] / 55 * 49)));


    shape.drawCircle(0, 0, this.radius);

    //Fill shape's color
    shape.endFill();
    shape.closePath();
    shape.x = this.position.x;
    shape.y = this.position.y;
  }
}

export { Animal };
