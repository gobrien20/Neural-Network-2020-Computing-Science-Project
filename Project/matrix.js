class Matrix{
  constructor(rows, cols){
    // Declaring variables
    this.rows = rows;
    this.cols = cols;
    this.cells = [];

    // Creating 2D-array filled with zeroes
    for(let i = 0; i < this.rows; i++){
      this.cells[i] = []
      for(let j = 0; j < this.cols; j++){
        this.cells[i][j] = 0
      }
    }
  }

  // Creating a new matrix from an array
  static fromArray(arr){
    let newMatrix = new Matrix(arr.length, 1);
    for(let i = 0; i < arr.length; i++){
      newMatrix.cells[i][0] = arr[i];
    }
    return newMatrix;
  }

  // Filling the matrix with random values between -1 and 1
  randomise(){
    for(let i = 0; i < this.rows; i++){
      for(let j = 0 ; j < this.cols; j++){
        this.cells[i][j] = random(-1, 1);
      }
    }
  }

  // Adding either, a matrix or, an integer to the matrix
  add(item){
    if(item instanceof Matrix){
      let adjustedItem = item
      if(this.rows > item.rows){
        if(this.cols > item.cols){
          adjustedItem = new Matrix(this.rows, this.cols);
          for(let i = 0; i < item.rows; i++){
            for(let j = 0; j < item.cols; j++){
              adjustedItem.cells[i][j] = item.cells[i][j];
            }
          }
        }else{
          adjustedItem = new Matrix(this.rows, item.cols);
          for(let i = 0; i < item.rows; i++){
            for(let j = 0; j < item.cols; j++){
              adjustedItem.cells[i][j] = item.cells[i][j];
            }
          }
          let newMatrix = new Matrix(this.rows, item.cols);
          for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
              newMatrix.cells[i][j] = this.cells[i][j];
            }
          }
          this.cells = newMatrix.cells;
          this.rows = newMatrix.rows;
          this.cols = newMatrix.cols;
        }
      }else{
        if(this.cols > item.cols){
          adjustedItem = new Matrix(item.rows, this.cols);
          for(let i = 0; i < item.rows; i++){
            for(let j = 0; j < item.cols; j++){
              adjustedItem.cells[i][j] = item.cells[i][j];
            }
          }
          let newMatrix = new Matrix(item.rows, this.cols);
          for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
              newMatrix.cells[i][j] = this.cells[i][j];
            }
          }
          this.cells = newMatrix.cells;
          this.rows = newMatrix.rows;
          this.cols = newMatrix.cols;
        }else{
          let newMatrix = new Matrix(item.rows, item.cols);
          for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
              newMatrix.cells[i][j] = this.cells[i][j];
            }
          }
          this.cells = newMatrix.cells;
          this.rows = newMatrix.rows;
          this.cols = newMatrix.cols;
        }
      }
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          this.cells[i][j] += adjustedItem.cells[i][j];
        }
      }
      return;
    }

    //if(item instanceof Number){
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          this.cells[i][j] += item;
        }
      }
    //}
  }

  // Creating a new matrix equal to, two matrices subtracted from each other
  static subtract(matrixA, matrixB){
    if(matrixA.rows == matrixB.rows && matrixA.cols == matrixB.cols){
      let newMatrix = new Matrix(matrixA.rows, matrixA.cols);
      for(let i = 0; i < matrixA.rows; i++){
        for(let j = 0; j < matrixA.cols; j++){
          newMatrix.cells[i][j] = matrixA.cells[i][j] - matrixB.cells[i][j];
        }
      }
      return newMatrix;
    }
  }

  // Multiplying two matrices
  static multiply(matrixA, matrixB){
    if(matrixA.cols == matrixB.rows){
      let newMatrix = new Matrix(matrixA.rows, matrixB.cols);
      for(let i = 0; i < newMatrix.rows; i++){
        for(let j = 0; j < newMatrix.cols; j++){
          let sum = 0;
          for(let k = 0; k < matrixA.cols; k++){
            sum += matrixA.cells[i][k] * matrixB.cells[k][j];
          }
          newMatrix.cells[i][j] = sum;
        }
      }
      return newMatrix;
    }
  }

  // Multiplying two matrices of equal dimensions
  multiply(item){
    if(item instanceof Matrix){
      if(item.rows == this.rows && item.cols == this.cols){
        for(let i = 0; i < this.rows; i++){
          for(let j = 0; j < this.cols; j++){
            this.cells[i][j] *= item.cells[i][j];
          }
        }
      }
      return;
    }

    //Multiplying the matrix by a integer
    //if(item instanceof Number){
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          this.cells[i][j] *= item;
        }
      }
    //}
  }

  // Applying a function to each element in the matrix
  map(func){
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        this.cells[i][j] = func(this.cells[i][j]);
      }
    }
  }

  // Creating a transposed matrix
  static transpose(matrix){
    let newMatrix = new Matrix(matrix.cols, matrix.rows);
    for(let i = 0; i < newMatrix.rows; i++){
      for(let j = 0; j < newMatrix.cols; j++){
        newMatrix.cells[i][j] = matrix.cells[j][i];
      }
    }
    return newMatrix;
  }

  // Creating an array from the matrix
  toArray(){
    let arr = [];
    for(let i = 0; i < this.rows; i++){
      arr[i] = this.cells[i][0];
    }
    return arr;
  }

  // Displaying the matrix as a table in the console
  print(){
    console.table(this.cells);
  }
}
