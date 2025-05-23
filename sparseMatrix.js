// Simple Sparse Matrix Class
class SparseMatrix {
  constructor(rows, cols) {
    // Basic error checking
    if (rows <= 0 || cols <= 0) {
      throw new Error("Matrix dimensions must be positive numbers");
    }
    
    this.rows = rows;
    this.cols = cols;
    // Using object to store non-zero values {row: {col: value}}
    this.data = {};
  }

  // Helper to check if position is valid
  _checkPosition(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(`Position (${row},${col}) is out of bounds`);
    }
  }

  // Get value at position (returns 0 if not set)
  get(row, col) {
    this._checkPosition(row, col);
    return this.data[row]?.[col] || 0;
  }

  // Set value at position
  set(row, col, value) {
    this._checkPosition(row, col);
    
    // Remove zero values to save space
    if (value === 0) {
      if (this.data[row]) {
        delete this.data[row][col];
        // Clean up empty rows
        if (Object.keys(this.data[row]).length === 0) {
          delete this.data[row];
        }
      }
      return;
    }
    
    // Initialize row if not exists
    if (!this.data[row]) {
      this.data[row] = {};
    }
    this.data[row][col] = value;
  }

  // Add two matrices
  static add(matrixA, matrixB) {
    // Check same dimensions
    if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) {
      throw new Error("Matrices must be same size to add");
    }
    
    const result = new SparseMatrix(matrixA.rows, matrixA.cols);
    
    // Add all values from matrixA
    for (const row in matrixA.data) {
      for (const col in matrixA.data[row]) {
        result.set(parseInt(row), parseInt(col), matrixA.get(parseInt(row), parseInt(col)));
      }
    }
    
    // Add values from matrixB
    for (const row in matrixB.data) {
      for (const col in matrixB.data[row]) {
        const r = parseInt(row);
        const c = parseInt(col);
        result.set(r, c, result.get(r, c) + matrixB.get(r, c));
      }
    }
    
    return result;
  }

  // Multiply two matrices
  static multiply(matrixA, matrixB) {
    // Check if multiplication is possible
    if (matrixA.cols !== matrixB.rows) {
      throw new Error("Cannot multiply - columns of A must match rows of B");
    }
    
    const result = new SparseMatrix(matrixA.rows, matrixB.cols);
    
    // For each non-zero in matrixA
    for (const rowA in matrixA.data) {
      for (const colA in matrixA.data[rowA]) {
        const r = parseInt(rowA);
        const c = parseInt(colA);
        const valA = matrixA.data[rowA][colA];
        
        // If matrixB has corresponding row (colA = rowB)
        if (matrixB.data[c]) {
          // Multiply with all elements in that row
          for (const colB in matrixB.data[c]) {
            const valB = matrixB.data[c][colB];
            result.set(r, parseInt(colB), result.get(r, parseInt(colB)) + valA * valB);
          }
        }
      }
    }
    
    return result;
  }

  // Create matrix from file content
  static fromString(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Get dimensions
    const rows = parseInt(lines[0].split('=')[1]);
    const cols = parseInt(lines[1].split('=')[1]);
    
    const matrix = new SparseMatrix(rows, cols);
    
    // Process each entry
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Extract numbers from (row,col,value)
      const parts = line.slice(1, -1).split(',').map(part => parseInt(part.trim()));
      if (parts.length !== 3) {
        throw new Error(`Invalid line format: ${line}`);
      }
      
      matrix.set(parts[0], parts[1], parts[2]);
    }
    
    return matrix;
  }

  // Convert matrix to string format
  toString() {
    let output = `rows=${this.rows}\ncols=${this.cols}\n`;
    
    for (const row in this.data) {
      for (const col in this.data[row]) {
        output += `(${row}, ${col}, ${this.data[row][col]})\n`;
      }
    }
    
    return output;
  }
}

module.exports = SparseMatrix;
