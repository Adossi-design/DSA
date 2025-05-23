const fs = require('fs');
const path = require('path');
const SparseMatrix = require('./src/sparseMatrix');

// Create results folder
if (!fs.existsSync('results')) fs.mkdirSync('results');

async function main() {
  try {
    console.log("Starting matrix operations...");
    
    // Load matrices
    console.log("Loading sample files...");
    const file1 = fs.readFileSync('sample_inputs/easy_sample_01_1.txt', 'utf8');
    const file2 = fs.readFileSync('sample_inputs/easy_sample_01_2.txt', 'utf8');
    const matrix1 = SparseMatrix.fromString(file1);
    const matrix2 = SparseMatrix.fromString(file2);
    
    console.log(`Matrix 1: ${matrix1.rows}x${matrix1.cols}`);
    console.log(`Matrix 2: ${matrix2.rows}x${matrix2.cols}`);
    
    // Addition
    console.log("Adding matrices...");
    const added = SparseMatrix.add(matrix1, matrix2);
    fs.writeFileSync('results/addition.txt', added.toString());
    
    // Multiplication
    console.log("Multiplying matrices...");
    const multiplied = SparseMatrix.multiply(matrix1, matrix2);
    fs.writeFileSync('results/multiplication.txt', multiplied.toString());
    
    console.log("Done! Results saved in /results folder");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
