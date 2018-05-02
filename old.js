var neataptic = require("neataptic");
var architect = neataptic.architect;
var Network = neataptic.Network;
var methods = neataptic.methods;

function Animal(parents, options) {
  this.roundMemory = 8;
  this.fitness = 0;
  var mutRate = 2;
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
    this.brain = architect.Random(this.roundMemory * 2, 2, 6);
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

function World(population, options) {
  this.population = Math.floor(population / 4) * 4;
  this.bonus = 2;
  this.cost = 1;
  this.roundLength = 8;
  this.roundMemory = 2;
  if (options) {
    if (options.bonus) this.bonus = options.bonus;
    if (options.cost) this.cost = options.cost;
  }
  this.animals = [];
  for (var i = 0; i < this.population; i++) {
    this.animals.push(new Animal(null, {
      roundMemory: this.roundMemory
    }));
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
      [1, 0, 0],
      [5, 4, 0],
      [0, 0, 0]
    ];
    pair[0].fitness += table[choiceB][choiceA];
    pair[1].fitness += table[choiceA][choiceB];
  }
}
World.prototype.step = function() {
  var aveFit = 0;
  var interactions=8;
  for(var j=0;j<interactions;j++){
    var pairs = this.derangePairs(this.animals);
    for (var i = 0; i < pairs.length; i++) {
      this.runPair(pairs[i]);
    }
  }
  var worstFit = 100;
  for (var i = 0; i < this.animals.length; i++) {
    this.animals[i].fitness = this.animals[i].fitness / this.roundLength/interactions;
    worstFit = Math.min(this.animals[i].fitness, worstFit);
  }
  var lives=[];
  this.animals.sort((a, b) => (b.fitness - a.fitness));
  for (var i = 0; i < this.animals.length; i++) {
    aveFit += this.animals[i].fitness / this.animals.length;
    for(var j=0;j<this.animals[i].fitness;j++){
      lives.push(this.animals[i]);
    }
  }
  var childs = [];
  for (var i = 0; i < this.animals.length / 32; i++) {
    childs.push(new Animal(null, {
      roundMemory: this.roundMemory
    }));
  }
  while (childs.length < this.animals.length) {
    var pairs = this.derangePairs(lives);
    for (var i = 0; i < pairs.length && childs.length < this.animals.length; i++) {
      childs.push(new Animal(pairs[i], {
        roundMemory: this.roundMemory
      }));
    }
  }
  this.animals = childs;
  return aveFit;
}
var w = new World(128);
var aveQ = 0;
for (var i = 0; i < 10000; i++) {
  var q = w.step();
  aveQ += q / 100;
  if (i % 100 === 0) {
    console.log(i, q, aveQ);
    aveQ = 0;
  }
}
//architect.Perceptron(2, 3, 1);
//console.log(neataptic);
