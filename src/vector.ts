class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  scale(s: number): Vector {
    return new Vector(this.x * s, this.y * s);
  }
  normalize(): Vector {
    if (this.length() === 0) {
      return new Vector(1, 0);
    }
    return this.scale(1 / this.length())
  }
}
export { Vector };
