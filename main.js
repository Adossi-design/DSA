import SparseMatrix from './src/SparseMatrix.js';
import fs from 'fs';

async function processOperations() {
  try {
    // Load matrices from command line arguments
    const matrix1 = await SparseMatrix.fromFile(process.argv[3]);
    const matrix2 = await SparseMatrix.fromFile(process.argv[4]);
    const outputFile = process.argv[5];

    console.log(`Matrix dimensions: ${matrix1.rows}x${matrix1.cols} and ${matrix2.rows}x${matrix2.cols}`);

    let result;
    switch (process.argv[2]) {
      case 'add':
        result = matrix1.add(matrix2);
        break;
      case 'subtract':
        result = matrix1.subtract(matrix2);
        break;
      case 'multiply':
        // Check if multiplication would create a too-large matrix
        if (matrix1.rows * matrix2.cols > 1000000) {
          console.warn('Warning: Multiplication result would be very large');
        }
        result = matrix1.multiply(matrix2);
        break;
      default:
        throw new Error(`Invalid operation: ${process.argv[2]}`);
    }

    await fs.promises.writeFile(outputFile, result.toString());
    console.log(`Operation completed. Result saved to ${outputFile}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Validate command line arguments
if (process.argv.length < 6) {
  console.log(
    'Usage: node main.js <operation> <matrix1> <matrix2> <output>\n' +
    'Operations: add, subtract, multiply\n' +
    'Example: node main.js add sample1.txt sample2.txt result.txt'
  );
  process.exit(1);
}

// Run with increased memory limit for large matrices
processOperations().catch(console.error);
