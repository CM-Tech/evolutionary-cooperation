var neataptic = require("neataptic");
var architect = neataptic.architect;
var Network = neataptic.Network;
var methods = neataptic.methods;

function Animal(parents, options) {
  this.roundMemory = 8;
  this.fitness = 0;
  var mutRate = 0;
  if (options) {
    if (options.roundMemory) this.roundMemory = options.roundMemory;


  }
  if (parents && parents.length > 1) {
    //mutRate=4-(parents[0].fitness)-(parents[1].fitness);
  }

  /*methods.mutation.MOD_BIAS.min=-mutRate;
  methods.mutation.MOD_BIAS.max=mutRate;
  methods.mutation.MOD_WEIGHT.min=-mutRate;
  methods.mutation.MOD_WEIGHT.max=mutRate;*/
  if (parents && parents.length > 1) {
    this.brain = Network.crossOver(parents[0].brain, parents[1].brain);
    //this.brain=Network.crossOver(architect.Random(this.roundMemory*2,2,10),this.brain);

    for (var i = 0; i < mutRate; i++) {
      this.brain.mutate(methods.mutation.ALL);
    }

    //this.brain.mutate(methods.mutation.MOD_BIAS);
    //this.brain.mutate(methods.mutation.MOD_WEIGHT);
    //this.brain.mutate(methods.mutation.ALL);
    //this.brain.mutate(methods.mutation.MOD_BIAS);
    //this.brain.mutate(methods.mutation.MOD_WEIGHT);
    //this.brain.mutate(methods.mutation.MOD_BIAS);
    //this.brain.mutate(methods.mutation.MOD_WEIGHT);

  } else {
    this.brain = architect.Random(this.roundMemory * 2, 2, 2);
    //this.brain.mutate(methods.mutation.ALL);
  }
  return this;
}
Animal.prototype.choice = function(rounds) {
  var res = this.brain.activate(rounds);
  if (res[0] > res[1]) {

    return 0;
  }

  return 1;
}

function World(size, options) {
  this.size=size;
  this.bonus = 2;
  this.cost = 1;
  this.roundLength = 8;
  this.roundMemory = 3;
  if (options) {
    if (options.bonus) this.bonus = options.bonus;
    if (options.cost) this.cost = options.cost;
  }
  var trainingSet = [
];
for(var k=0;k<100;k++){
var input=[1,1];
for(var h=0;h<this.roundMemory;h++){
input.push(input[input.length-1],Math.floor(Math.random()*2));
}
input.shift();
input.shift();
var output=[0,0];
output[input[input.length-1]]=1;
var set={input: input, output:output};
trainingSet.push(set);
}
this.tSet=trainingSet;
  this.animals = [];
  for (var i = 0; i < this.size.h; i++) {
    this.animals[i]=[];
    for (var j = 0; j < this.size.w; j++) {
      this.animals[i].push(new Animal(null, {
        roundMemory: this.roundMemory
      }));

    }
  }
}
World.prototype.derangePairs = function(list) {
  var randomList = [];
  for (var i = 0; i < list.length; i++) {
    randomList.splice(Math.floor(Math.random() * randomList.length), 0, list[i]);
  }
  var pairs = [];
  for (var i = 0; i < randomList.length; i += 2) {
    pairs.push([randomList[i], randomList[(i + 1) % randomList.length]]);
  }
  return pairs;
}
World.prototype.runPair = function(pair) {
  var recordA = [];
  var recordB = [];
  for (var i = 0; i < this.roundMemory * 2; i++) {
    recordA.push(1);
    recordB.push(1);
  }
  for (var i = 0; i < this.roundLength; i++) {
    var choiceA = pair[0].choice(recordA);
    var choiceB = pair[1].choice(recordB);
    recordA.shift();
    recordA.shift();
    recordA.push(choiceA);
    recordA.push(choiceB);
    recordB.shift();
    recordB.shift();
    recordB.push(choiceB);
    recordB.push(choiceA);
    var table = [
      [-1, -4],
      [5, 4]
    ];
    pair[0].fitness += table[choiceB][choiceA];
    pair[1].fitness += table[choiceA][choiceB];
  }
}
World.prototype.titForTatness = function(animal) {
  var titForTatnessv=0;
  var randChoices=[];
  for (var i = 0; i < this.roundLength; i++) {
    randChoices.push(Math.floor(Math.random()*2));
  }
  var recordA = [];
  var recordB = [];
  for (var i = 0; i < this.roundMemory * 2; i++) {
    recordA.push(1);
    recordB.push(1);
  }
  for (var i = 0; i < this.roundLength; i++) {
    var choiceA = animal.choice(recordA);
    var choiceB = randChoices[i];//recordB[recordB.length];
    recordA.shift();
    recordA.shift();
    recordA.push(choiceA);
    recordA.push(choiceB);
    recordB.shift();
    recordB.shift();
    recordB.push(choiceB);
    recordB.push(choiceA);
    if(choiceA===(i>0?randChoices[i-1]:1)){
      titForTatnessv++;
    }
  }
  return titForTatnessv/this.roundLength;
}
World.prototype.aveTitForTatness = function() {
  var ave=0;
  for (var y = 0; y < this.animals.length; y++) {
    for (var x = 0; x < this.animals[y].length; x++) {
      ave+=this.titForTatness(this.animals[y][x])/ this.size.w/this.size.h;

    }
  }
  return ave;
}
World.prototype.coopness = function(animal) {
  var titForTatnessv=0;
  var randChoices=[];
  for (var i = 0; i < this.roundLength; i++) {
    randChoices.push(Math.floor(Math.random()*2));
  }
  var recordA = [];
  var recordB = [];
  for (var i = 0; i < this.roundMemory * 2; i++) {
    recordA.push(1);
    recordB.push(1);
  }
  for (var i = 0; i < this.roundLength; i++) {
    var choiceA = animal.choice(recordA);
    var choiceB = randChoices[i];//recordB[recordB.length];
    recordA.shift();
    recordA.shift();
    recordA.push(choiceA);
    recordA.push(choiceB);
    recordB.shift();
    recordB.shift();
    recordB.push(choiceB);
    recordB.push(choiceA);
    if(choiceA===1){
      titForTatnessv++;
    }
  }
  return titForTatnessv/this.roundLength;
}
World.prototype.aveCoopness = function() {
  var ave=0;
  for (var y = 0; y < this.animals.length; y++) {
    for (var x = 0; x < this.animals[y].length; x++) {
      ave+=this.coopness(this.animals[y][x])/ this.size.w/this.size.h;

    }
  }
  return ave;
}
World.prototype.step = function() {
  var aveFit = 0;
  var interactions=1;
  for(var j=0;j<interactions;j++){
    for (var y = 0; y < this.animals.length; y++) {
      for (var x = 0; x < this.animals[y].length; x++) {
        this.runPair([this.animals[y][x],this.animals[y][(x+1)%this.size.w]]);
        this.runPair([this.animals[y][x],this.animals[(y+1)%this.size.h][(x+1)%this.size.w]]);
        this.runPair([this.animals[y][x],this.animals[(y+1)%this.size.h][x]]);
        this.runPair([this.animals[y][x],this.animals[(y+1)%this.size.h][(x-1+this.size.w)%this.size.w]]);
      }
    }
  }
  var worstFit = 100;
  for (var y = 0; y < this.animals.length; y++) {
    for (var x = 0; x < this.animals[y].length; x++) {
      this.animals[y][x].fitness = this.animals[y][x].fitness / this.roundLength/interactions/8;
      aveFit += this.animals[y][x].fitness / this.size.w/this.size.h;
      worstFit = Math.min(this.animals[y][x].fitness, worstFit);
    }
  }
  var childs = [];
  for (var i = 0; i < this.size.h; i++) {
    childs[i]=[];
    for (var j = 0; j < this.size.w; j++) {
      var bestOther=null;
      for (var dy = -1; dy < 2; dy++) {
        for (var dx = -1; dx < 2; dx++) {
          if(dx*dx+dy*dy===1){
            var other=this.animals[(i+dy+this.size.h)%this.size.h][(j+dx+this.size.w)%this.size.w];
            if(!bestOther){
              bestOther=other;
            }else if(bestOther.fitness<other.fitness){
              bestOther=other;
            }
          }
        }
      }
      if(Math.random()>0){
        childs[i].push(new Animal([bestOther,this.animals[i][j]], {
          roundMemory: this.roundMemory
        }));
      }else{

        childs[i].push(new Animal(null, {
          roundMemory: this.roundMemory
        }));

      }
    }
  }
  if(Math.random()*this.size.w*this.size.h>50){
  var n=Math.floor(Math.random()*this.size.w*this.size.h);
  childs[n%this.size.h][Math.floor(n/this.size.h)]=new Animal(null, {
    roundMemory: this.roundMemory
  });
/*  if(Math.random()>0){
        childs[n%this.size.h][Math.floor(n/this.size.h)].brain.evolve(this.tSet, {
          equal: true,
          error: 0.03
         });
       }
       */
}
  this.animals = childs;
  return aveFit;
}
var sq=10;
var wo = new World({w:sq,h:sq});
var aveQ = 0;
var logStep=100;
console.log(wo.aveTitForTatness(),wo.aveCoopness());
for (var i = 0; i < 100000; i++) {
  var q = wo.step();
  aveQ += q / logStep;
  if (i % logStep === logStep-1) {
    var pes=100;
    console.log(Math.floor(i*pes)/pes, Math.floor(aveQ*pes)/pes,Math.floor(wo.aveTitForTatness()*pes)/pes,Math.floor(wo.aveCoopness()*pes)/pes);
    aveQ = 0;
  }
}
//architect.Perceptron(2, 3, 1);
//console.log(neataptic);
