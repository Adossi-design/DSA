const fs = require('fs');
const path = require('path');
const SparseMatrix = require('./sparseMatrix');

// Create results directory if it doesn't exist
if (!fs.existsSync('results')) {
  fs.mkdirSync('results');
}

async function processMatrices() {
  try {
    console.log("Starting matrix operations...");
    
    // Read sample files
    console.log("Reading sample files...");
    const sample1 = fs.readFileSync('sample_inputs/easy_sample_01_1.txt', 'utf8');
    const sample2 = fs.readFileSync('sample_inputs/easy_sample_01_2.txt', 'utf8');
    
    // Create matrices
    const matrix1 = SparseMatrix.fromString(sample1);
    const matrix2 = SparseMatrix.fromString(sample2);
    
    console.log("Matrix 1 dimensions:", matrix1.rows, "x", matrix1.cols);
    console.log("Matrix 2 dimensions:", matrix2.rows, "x", matrix2.cols);
    
    // Perform operations
    console.log("Adding matrices...");
    const added = SparseMatrix.add(matrix1, matrix2);
    fs.writeFileSync('results/addition_result.txt', added.toString());
    
    console.log("Multiplying matrices...");
    const multiplied = SparseMatrix.multiply(matrix1, matrix2);
    fs.writeFileSync('results/multiplication_result.txt', multiplied.toString());
    
    console.log("Done! Results saved in /results folder");
  } catch (error) {
    console.error("Something went wrong:", error.message);
  }
}

// Run the program
processMatrices();
