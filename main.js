const fs = require('fs');
const path = require('path');
const SparseMatrix = require('./src/SparseMatrix');

// Create results folder if missing
if (!fs.existsSync('results')) fs.mkdirSync('results');

// Process all sample files
function processMatrices() {
  try {
    console.log("Loading matrices...");

    // Load matrices (change filenames as needed)
    const matrix1 = SparseMatrix.fromString(
      fs.readFileSync('sample_inputs/easy_sample_01_2.txt', 'utf8')
    );
    const matrix2 = SparseMatrix.fromString(
      fs.readFileSync('sample_inputs/easy_sample_02_1.txt', 'utf8')
    );

    console.log("Adding matrices...");
    const added = SparseMatrix.add(matrix1, matrix2);
    fs.writeFileSync('results/addition_result.txt', added.toString());

    console.log("Multiplying matrices...");
    const multiplied = SparseMatrix.multiply(matrix1, matrix2);
    fs.writeFileSync('results/multiplication_result.txt', multiplied.toString());

    console.log("Done! Check the /results folder.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the program
processMatrices();
