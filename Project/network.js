class Network{
  constructor(inputNodes, hiddenLayers, hiddenNodes, outputNodes){
    // Create weights matrices based on the values passed in
    this.weights = [];
    for(let i = 0; i < hiddenLayers + 1; i++){
      if(i == 0){
        this.weights[i] = new Matrix(hiddenNodes, inputNodes + 1);
      }else if(i == hiddenLayers){
        this.weights[i] = new Matrix(outputNodes, hiddenNodes + 1);
      }else{
        this.weights[i] = new Matrix(hiddenNodes, hiddenNodes + 1);
      }
      this.weights[i].randomise();
    }

    // Define the learning rate
    this.learningRate = 0.1;
  }

  feedforward(inputsArr, targetsArr){
    // Create an empty array for the hidden values
    this.hidden = [];

    // Add bias values to the inputs
    if(inputsArr.length <= 2){
      inputsArr[inputsArr.length] = 1;
    }

    // Create a matrix for the inputs
    let inputs = Matrix.fromArray(inputsArr);
    // Multiply by the weights
    let weighted = Matrix.multiply(this.weights[0], inputs);
    // Set the first hidden values to this weighted matrix, and add biases
    this.hidden[0] = new Matrix(weighted.rows + 1, weighted.cols)
    this.hidden[0].add(weighted);
    this.hidden[0].cells[this.hidden[0].rows] = [1];
    // Activate this layer
    this.hidden[0].map(sigmoid);

    // Loop through the other layers and carry out the same operations on each
    for(let i = 1; i < this.weights.length; i++){
      weighted = Matrix.multiply(this.weights[i], this.hidden[i - 1]);
      if(i < this.weights.length - 1){
        this.hidden[i] = new Matrix(weighted.rows + 1, weighted.cols)
        this.hidden[i].add(weighted);
        this.hidden[i].cells[this.hidden[i].rows] = [1];
      }else{
        this.hidden[i] = weighted;
      }
      this.hidden[i].map(sigmoid);
    }

    // Format he outputs for further usage, and get the errors
    let outputs = this.hidden[this.hidden.length - 1];
    let targets = Matrix.fromArray(targetsArr);
    let errors = Matrix.subtract(targets, outputs);
    let outputMatrix = new Matrix(2, outputs.rows);
    outputMatrix.cells[0] = outputs.toArray();
    outputMatrix.cells[1] = errors.toArray();
    return outputMatrix;
  }

  backpropogate(inputsArr, targetsArr){
    // Get the current guesses and errors
    let outputMatrix = this.feedforward(inputsArr, targetsArr);
    let outputs = Matrix.fromArray(outputMatrix.cells[0]);
    let errors = Matrix.fromArray(outputMatrix.cells[1]);

    // Calculate the gradient descent to adjust the first weights layer
    let gradients = outputs;
    gradients.map(dsigmoid);
    gradients.multiply(errors);
    gradients.multiply(this.learningRate);

    // Get the corrections for the first weights layer
    let transposed = Matrix.transpose(this.hidden[this.hidden.length - 1]);
    let corrections = Matrix.multiply(gradients, transposed);

    // Adjust the first weights layer
    this.weights[this.weights.length - 1].add(corrections);

    // Start at the second last layer and loop backwards
    for(let i = this.weights.length - 2; i >= 0; i--){
      // Use the previous change to get the errors for this layer
      let weightsTransposed = Matrix.transpose(this.weights[i + 1]);
      errors = Matrix.multiply(weightsTransposed, errors);

      // Set the current layer to the layer at this index, without the biases
      let currentLayer = new Matrix(this.hidden[i].rows - 1, this.hidden[i].cols);

      for(let a = 0; a < currentLayer.rows; a++){
        for(let b = 0; b < currentLayer.cols; b++){
          currentLayer.cells[a][b] = this.hidden[i].cells[a][b];
        }
      }

      // Calculate the gradient descent for the current layer
      gradients = currentLayer;
      gradients.map(dsigmoid);
      gradients.multiply(errors);
      gradients.multiply(this.learningRate);

      // Get the corrections for this layer
      transposed = Matrix.transpose(this.hidden[i]);
      corrections = Matrix.multiply(gradients, transposed);

      // Adjust the current layer
      this.weights[i].add(corrections);
    }
  }
}
