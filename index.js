var neataptic = require("neataptic");
var architect = neataptic.architect;
var Network = neataptic.Network;
var methods = neataptic.methods;
var asciichart = require('asciichart');
var sprintf = require('sprintf-js').sprintf,
  vsprintf = require('sprintf-js').vsprintf;

function clear() {
  console.clear();
  //process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');//process.stdout.write('\x1B[2J\x1B[0f');
}

function Animal(parents, options) {
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
  this.size = size;
  this.defectBonus = 3 / 5;
  this.defectPenalty = 4 / 5;
  this.roundLength = 8;
  this.roundMemory = 3;
  if (options) {
    if (options.defectBonus) this.defectBonus = options.defectBonus;
    if (options.defectPenalty) this.defectPenalty = options.defectPenalty;
  }
  var trainingSet = [];
  for (var k = 0; k < 100; k++) {
    var input = [1, 1];
    for (var h = 0; h < this.roundMemory; h++) {
      input.push(input[input.length - 1]);
      input.push(Math.floor(Math.random() * 2));
    }
    input.shift();
    input.shift();
    var output = [0, 0];
    output[Math.floor(input[input.length - 1])] = 1;
    var set = {
      input: input,
      output: output
    };
    trainingSet.push(set);
  }
  this.tSet = trainingSet;
  this.titForTatAnimal = new Animal(null, {
    roundMemory: this.roundMemory
  });
  /*
  this.titForTatAnimal.brain.train(this.tSet, {
    error: 0.03,
    iterations: 1000,
    rate: 0.3
  });*/
  console.log("Tit For Tat Animal Score", Math.floor(this.titForTatness(this.titForTatAnimal) * 100) + "%");
  this.animals = [];
  for (var i = 0; i < this.size.h; i++) {
    this.animals[i] = [];
    for (var j = 0; j < this.size.w; j++) {
      //this.animals[i].push(this.titForTatAnimal);
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
      [1 - this.defectPenalty, 0],
      [this.defectBonus + 1, 1]
    ];
    pair[0].fitness += table[choiceB][choiceA];
    pair[1].fitness += table[choiceA][choiceB];
  }
}
World.prototype.titForTatness = function(animal) {
  var titForTatnessv = 0;
  var randChoices = [];
  for (var i = 0; i < this.roundLength; i++) {
    randChoices.push(Math.floor(Math.random() * 2));
  }
  var recordA = [];
  var recordB = [];
  for (var i = 0; i < this.roundMemory * 2; i++) {
    recordA.push(1);
    recordB.push(1);
  }
  for (var i = 0; i < this.roundLength; i++) {
    var choiceA = animal.choice(recordA);
    var choiceB = randChoices[i]; //recordB[recordB.length];
    recordA.shift();
    recordA.shift();
    recordA.push(choiceA);
    recordA.push(choiceB);
    recordB.shift();
    recordB.shift();
    recordB.push(choiceB);
    recordB.push(choiceA);
    if (choiceA === (i > 0 ? randChoices[i - 1] : 1)) {
      titForTatnessv++;
    }
  }
  return titForTatnessv / this.roundLength;
}
World.prototype.aveTitForTatness = function() {
  var ave = 0;
  for (var y = 0; y < this.animals.length; y++) {
    for (var x = 0; x < this.animals[y].length; x++) {
      ave += this.titForTatness(this.animals[y][x]) / this.size.w / this.size.h;
    }
  }
  return ave;
}
World.prototype.coopness = function(animal) {
  var titForTatnessv = 0;
  var randChoices = [];
  for (var i = 0; i < this.roundLength; i++) {
    randChoices.push(Math.floor(Math.random() * 2));
  }
  var recordA = [];
  var recordB = [];
  for (var i = 0; i < this.roundMemory * 2; i++) {
    recordA.push(1);
    recordB.push(1);
  }
  for (var i = 0; i < this.roundLength; i++) {
    var choiceA = animal.choice(recordA);
    var choiceB = randChoices[i]; //recordB[recordB.length];
    recordA.shift();
    recordA.shift();
    recordA.push(choiceA);
    recordA.push(choiceB);
    recordB.shift();
    recordB.shift();
    recordB.push(choiceB);
    recordB.push(choiceA);
    if (choiceA === 1) {
      titForTatnessv++;
    }
  }
  return titForTatnessv / this.roundLength;
}
World.prototype.aveCoopness = function() {
  var ave = 0;
  for (var y = 0; y < this.animals.length; y++) {
    for (var x = 0; x < this.animals[y].length; x++) {
      ave += this.coopness(this.animals[y][x]) / this.size.w / this.size.h;
    }
  }
  return ave;
}
World.prototype.step = function() {
  var aveFit = 0;
  var interactions = 1;
  for (var j = 0; j < interactions; j++) {
    for (var y = 0; y < this.animals.length; y++) {
      for (var x = 0; x < this.animals[y].length; x++) {
        this.runPair([this.animals[y][x], this.animals[y][(x + 1) % this.size.w]]);
        this.runPair([this.animals[y][x], this.animals[(y + 1) % this.size.h][(x + 1) % this.size.w]]);
        this.runPair([this.animals[y][x], this.animals[(y + 1) % this.size.h][x]]);
        this.runPair([this.animals[y][x], this.animals[(y + 1) % this.size.h][(x - 1 + this.size.w) % this.size.w]]);
      }
    }
  }
  var worstFit = 100;
  for (var y = 0; y < this.animals.length; y++) {
    for (var x = 0; x < this.animals[y].length; x++) {
      this.animals[y][x].fitness = this.animals[y][x].fitness / this.roundLength / interactions / 8;
      aveFit += this.animals[y][x].fitness / this.size.w / this.size.h;
      worstFit = Math.min(this.animals[y][x].fitness, worstFit);
    }
  }
  var childs = [];
  for (var i = 0; i < this.size.h; i++) {
    childs[i] = [];
    for (var j = 0; j < this.size.w; j++) {
      var bestOther = null;
      for (var dy = -1; dy < 2; dy++) {
        for (var dx = -1; dx < 2; dx++) {
          if (dx * dx + dy * dy === 1) {
            var other = this.animals[(i + dy + this.size.h) % this.size.h][(j + dx + this.size.w) % this.size.w];
            if (!bestOther) {
              bestOther = other;
            } else if (bestOther.fitness < other.fitness) {
              bestOther = other;
            }
          }
        }
      }
      childs[i].push(new Animal([bestOther, this.animals[i][j]], {
        roundMemory: this.roundMemory
      }));
    }
  }
  var adds = Math.random() * this.size.w * this.size.h / 50;
  for (var a = 1; a < adds; a++) {
    var n = Math.floor(Math.random() * this.size.w * this.size.h);
    childs[n % this.size.h][Math.floor(n / this.size.h)] = new Animal(null, {
      roundMemory: this.roundMemory
    });
  }
  this.animals = childs;
  return aveFit;
}
var args = {
  defectBonus: 0.7,
  defectPenalty: 0.8
};
if (process.argv) {
  if (process.argv.length > 2) {
    var argArray = process.argv.slice(2);
    if (argArray.indexOf("--defectBonus") > -1) {
      var argIndex = argArray.indexOf("--defectBonus");
      if (argIndex < argArray.length - 1) {
        var value = parseFloat(argArray[argIndex + 1]);
        if (value) {
          args.defectBonus = value;
        }
      }
    }
    if (argArray.indexOf("--defectPenalty") > -1) {
      var argIndex = argArray.indexOf("--defectPenalty");
      if (argIndex < argArray.length - 1) {
        var value = parseFloat(argArray[argIndex + 1]);
        if (value) {
          args.defectPenalty = value;
        }
      }
    }
    if (argArray.indexOf("-b") > -1) {
      var argIndex = argArray.indexOf("-b");
      if (argIndex < argArray.length - 1) {
        var value = parseFloat(argArray[argIndex + 1]);
        if (value) {
          args.defectBonus = value;
        }
      }
    }
    if (argArray.indexOf("-p") > -1) {
      var argIndex = argArray.indexOf("-p");
      if (argIndex < argArray.length - 1) {
        var value = parseFloat(argArray[argIndex + 1]);
        if (value) {
          args.defectPenalty = value;
        }
      }
    }
  }
}
var sq = 10;
console.log(args);
var wo = new World({
  w: sq,
  h: sq
}, args);
var aveQ = 0;
var logStep = 5;
console.log(wo.aveTitForTatness(), wo.aveCoopness());
var averageGraph = [0, 1];
var aveGraphLen = 80;
for (var i = 0; i < 100000; i++) {
  var q = wo.step();
  aveQ += q / logStep;
  if (i % logStep === 0) {
    var pes = 100;

    averageGraph.push(aveQ);
    if (averageGraph.length > aveGraphLen) {
      averageGraph.shift();
    }
    averageGraph[0] = 0;
    averageGraph[1] = 1;
    var s0 = new Array(averageGraph.length);
    for (var j = 0; j < s0.length; j++) {
      s0[j] = averageGraph[j];
    }
    var chart = asciichart.plot(s0, {
      height: 24
    });
    clear();
    console.log(chart);
    console.log("     Round     Average");
    console.log(sprintf("%10f  %10.5f", i, aveQ));
    //console.log(Math.floor(i * pes) / pes, Math.floor(aveQ * pes) / pes, Math.floor(wo.aveTitForTatness() * pes) / pes, Math.floor(wo.aveCoopness() * pes) / pes);
    aveQ = 0;
  }
}
//architect.Perceptron(2, 3, 1);
//console.log(neataptic);
