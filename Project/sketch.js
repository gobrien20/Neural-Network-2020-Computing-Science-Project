// Declare initial values

// Training data
const data = [
  {
    inputs: [0, 1],
    targets: [1]
  },
  {
    inputs: [1, 0],
    targets: [1]
  },
  {
    inputs: [1, 1],
    targets: [0]
  },
  {
    inputs: [0, 0],
    targets: [0]
  }
];


// Neural Network
let nn;

// Arrays for the users inputed values
let inputs = [];
let targets = [];

// Arrays for the outputs
let chronologicalOutputs = [];
let sortedOutputs = [];

// Current index for the outputs
let index = 0;

// Flag for if the inputs are invalid
let invalid = false;

// Activation function
function sigmoid(value){
  return 1 / (1 + Math.exp(-value));
}

// Inverse of the activation function
function dsigmoid(value){
  return value * (1 - value);
}

// Setup, ran at the beginning of the program, handled by p5.js
function setup(){
  // Instancing the Neural Network
  nn = new Network(2, 1, 2, 1);
  // Creating a canvas inside the graph div
  let canvas = createCanvas(400, 400);
  canvas.parent("graph");
}

// Draw, ran once every frame, handled by p5.js
function draw(){
  // Drawing a background, as a dark grey
  background(51);

  // Setting the colour of the lines
  stroke(255, 255, 255, 100);

  // Drawing a zero line, halfway uo the canvas, across the whole canvas
  line(0, height * 0.5, width, height * 0.5);

  // Drawing the graph
  beginShape();
  let spacing = width / chronologicalOutputs.length;
  noFill();
  for(let i = 0; i < chronologicalOutputs.length; i++){   //height - 10 so that the entire graph is visible on the canvas
    vertex(spacing * i, 0.5 * height - chronologicalOutputs[i][1] * 0.5 * (height - 10));
    stroke(255, 0, 0);
    circle(spacing * i, 0.5 * height - chronologicalOutputs[i][1] * 0.5 * (height - 10), 2);
    stroke(255);
  }
  endShape();
}

// Getting the user's inputs/input validation
function getInputs(){
  if(document.getElementById("input1").value != "0" && document.getElementById("input1").value != "1"){
    document.getElementById("input1").style.color  = "red";
    invalid = true;
    alert("invalid input");
    return;
  }else{
    document.getElementById("input1").style.color  = "black";
    inputs[0] = Number(document.getElementById("input1").value);
  }

  if(document.getElementById("input2").value != "0" && document.getElementById("input2").value != "1"){
    document.getElementById("input2").style.color  = "red";
    invalid = true;
    alert("invalid input");
    return;
  }else{
    document.getElementById("input2").style.color  = "black";
    inputs[1] = Number(document.getElementById("input2").value);
  }
}

// Calculating the tragets, based on the user's inputs
function getTargets(){
  targets[0] = ((inputs[0] == inputs[1]) ? 0 : 1);
}

// Training the network and taking a guess
function start(){
  getInputs();
  getTargets();

  // Early return if the inputs are invalid
  if(invalid){
    invalid = false;
    return;
  }

  // Training the network
  for(let i = 0; i < 27; i++){
    nn.backpropogate(data[i%4].inputs, data[i%4].targets);
  }

  // Taking a guess
  let outputMatrix = nn.feedforward(inputs, targets);
  chronologicalOutputs[index] = [outputMatrix.cells[0][0], outputMatrix.cells[1][0]];
  sortedOutputs[index] = [outputMatrix.cells[0][0], outputMatrix.cells[1][0]];

  // Getting the table
  let table = document.getElementById("table");

  // Removing any previous data
  while(table.hasChildNodes()){
    table.removeChild(table.firstChild);
  }

  // Populating the table with the guesses
  let headings1 = document.createElement("TR");
  let item1 = document.createElement("TD");
  item1.appendChild(document.createTextNode("Current Output"));
  headings1.appendChild(item1);
  let item2 = document.createElement("TD");
  item2.appendChild(document.createTextNode("Current Error"));
  headings1.appendChild(item2);
  table.appendChild(headings1);

  let current = document.createElement("TR");
  item1 = document.createElement("TD");
  item1.appendChild(document.createTextNode(chronologicalOutputs[index][0]));
  current.appendChild(item1);
  item2 = document.createElement("TD");
  item2.appendChild(document.createTextNode(abs(chronologicalOutputs[index][1])));
  current.appendChild(item2);
  table.appendChild(current);

  let headings2 = document.createElement("TR");
  item1 = document.createElement("TD");
  item1.appendChild(document.createTextNode("Best Outputs"));
  headings2.appendChild(item1);
  item2 = document.createElement("TD");
  item2.appendChild(document.createTextNode("Best Errors"));
  headings2.appendChild(item2);
  table.appendChild(headings2);

  // Sorting the outputs
  insSort();

  // Finding if there are more than five guesses already, if not then using the number of guesses as the number of rows to add
  let max = ((sortedOutputs.length >= 5) ? 5 : sortedOutputs.length);

  // Creating and adding rows to the table
  let rows = [];
  for(let i = 0; i < max; i++){
    rows[i] = document.createElement("TR");
    let cell1 = document.createElement("TD");
    cell1.appendChild(document.createTextNode(sortedOutputs[i][0]));
    rows[i].appendChild(cell1);
    let cell2 = document.createElement("TD");
    cell2.appendChild(document.createTextNode(abs(sortedOutputs[i][1])));
    rows[i].appendChild(cell2);
    table.appendChild(rows[i]);
  }

  // Increasing the index by one
  index++;

  // Resetting the input arrays
  inputs = [];
  targets = [];

  // Recursing to get more guesses
  if(index % 3 != 0){
    start();
  }
}

// Insertion sort for the output array
function insSort(){
  let current;
  let index = 0;

  for(let i = 0; i < sortedOutputs.length; i++){
    current = sortedOutputs[i];
    index = i;

    while(index > 0 && abs(current[1]) < abs(sortedOutputs[index - 1][1])){
      sortedOutputs[index] = sortedOutputs[index - 1];
      index--;
    }

    sortedOutputs[index] = current;
  }
}
