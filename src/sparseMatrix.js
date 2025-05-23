class SparseMatrix {
  constructor(rows, cols) {
    if (rows <= 0 || cols <= 0) throw new Error("Dimensions must be positive");
    this.rows = rows;
    this.cols = cols;
    this.data = {};
  }

  _checkPosition(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error(`Position (${row},${col}) is invalid`);
    }
  }

  get(row, col) {
    this._checkPosition(row, col);
    return this.data[row]?.[col] || 0;
  }

  set(row, col, value) {
    this._checkPosition(row, col);
    if (value === 0) {
      if (this.data[row]) {
        delete this.data[row][col];
        if (Object.keys(this.data[row]).length === 0) delete this.data[row];
      }
    } else {
      if (!this.data[row]) this.data[row] = {};
      this.data[row][col] = value;
    }
  }

  static add(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) throw new Error("Matrix sizes must match");
    const result = new SparseMatrix(a.rows, a.cols);
    
    // Copy all elements from a
    for (const row in a.data) {
      for (const col in a.data[row]) {
        result.set(parseInt(row), parseInt(col), a.get(parseInt(row), parseInt(col)));
      }
    }
    
    // Add elements from b
    for (const row in b.data) {
      for (const col in b.data[row]) {
        const r = parseInt(row), c = parseInt(col);
        result.set(r, c, result.get(r, c) + b.get(r, c));
      }
    }
    
    return result;
  }

  static multiply(a, b) {
    if (a.cols !== b.rows) throw new Error("Columns of A must match rows of B");
    const result = new SparseMatrix(a.rows, b.cols);
    
    for (const rowA in a.data) {
      for (const colA in a.data[rowA]) {
        const valA = a.data[rowA][colA];
        if (b.data[colA]) {
          for (const colB in b.data[colA]) {
            result.set(
              parseInt(rowA),
              parseInt(colB),
              result.get(parseInt(rowA), parseInt(colB)) + valA * b.data[colA][colB]
            );
          }
        }
      }
    }
    
    return result;
  }

  static fromString(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const rows = parseInt(lines[0].split('=')[1]);
    const cols = parseInt(lines[1].split('=')[1]);
    const matrix = new SparseMatrix(rows, cols);
    
    for (let i = 2; i < lines.length; i++) {
      const [row, col, value] = lines[i]
        .slice(1, -1)
        .split(',')
        .map(x => parseInt(x.trim()));
      matrix.set(row, col, value);
    }
    
    return matrix;
  }

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
