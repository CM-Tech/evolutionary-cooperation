/// <reference path="../node_modules/@types/pixi.js/index.d.ts" />
import "pixi.js";
//Create a Pixi Application
let app = new PIXI.Application({width: 256, height: 256});
app.renderer.autoResize = true;
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
window.onresize=function(){
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
let triangle = new PIXI.Graphics();
triangle.beginFill(0x66FF33);

//Use `drawPolygon` to define the triangle as
//a path array of x/y positions

triangle.drawPolygon([
    -32, 64,             //First point
    32, 64,              //Second point
    0, 0                 //Third point
]);

//Fill shape's color
triangle.endFill();

//Position the triangle after you've drawn it.
//The triangle's x/y position is anchored to its first point in the path
triangle.x = 180;
triangle.y = 22;

app.stage.addChild(triangle);
window.setInterval(function(){
  var radius=Math.min(window.innerWidth,window.innerHeight);
  var angle=new Date().getTime()/1000;
  triangle.x = window.innerWidth/2+radius/4*Math.cos(angle);
  triangle.y = window.innerHeight/2+radius/4*Math.sin(angle);
  triangle.rotation=angle;
},10);
