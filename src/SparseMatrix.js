/** Handles sparse matrices efficiently */
class SparseMatrix {
  constructor(rows, cols) {
    this.rows = rows;  // Total rows
    this.cols = cols;  // Total columns
    this.data = {};    // Stores non-zero values: {row: {col: value}}
  }

  /** Set value at (row, col) */
  set(row, col, value) {
    if (value === 0) {
      // Remove zero values to save space
      if (this.data[row]) {
        delete this.data[row][col];
        if (Object.keys(this.data[row]).length === 0) delete this.data[row];
      }
    } else {
      // Store non-zero values
      if (!this.data[row]) this.data[row] = {};
      this.data[row][col] = value;
    }
  }

  /** Get value at (row, col) (returns 0 if empty) */
  get(row, col) {
    return this.data[row]?.[col] || 0;
  }

  /** Load matrix from text (like your sample files) */
  static fromString(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const rows = parseInt(lines[0].split('=')[1]);
    const cols = parseInt(lines[1].split('=')[1]);
    const matrix = new SparseMatrix(rows, cols);

    for (let i = 2; i < lines.length; i++) {
      const [r, c, v] = lines[i].slice(1, -1).split(',').map(Number);
      matrix.set(r, c, v);
    }
    return matrix;
  }

  /** Convert matrix back to text format */
  toString() {
    let output = `rows=${this.rows}\ncols=${this.cols}\n`;
    for (const row in this.data) {
      for (const col in this.data[row]) {
        output += `(${row}, ${col}, ${this.data[row][col]})\n`;
      }
    }
    return output;
  }

  /** Add two matrices */
  static add(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) throw Error("Matrix sizes must match!");
    const result = new SparseMatrix(a.rows, a.cols);

    // Copy all values from A
    for (const row in a.data) {
      for (const col in a.data[row]) {
        result.set(parseInt(row), parseInt(col), a.get(parseInt(row), parseInt(col)));
      }
    }

    // Add values from B
    for (const row in b.data) {
      for (const col in b.data[row]) {
        const r = parseInt(row), c = parseInt(col);
        result.set(r, c, result.get(r, c) + b.get(r, c));
      }
    }

    return result;
  }

  /** Multiply two matrices */
  static multiply(a, b) {
    if (a.cols !== b.rows) throw Error("Cannot multiply: columns(A) ≠ rows(B)");
    const result = new SparseMatrix(a.rows, b.cols);

    for (const rowA in a.data) {
      for (const colA in a.data[rowA]) {
        const valA = a.data[rowA][colA];
        if (b.data[colA]) {
          for (const colB in b.data[colA]) {
            const valB = b.data[colA][colB];
            result.set(
              parseInt(rowA),
              parseInt(colB),
              result.get(parseInt(rowA), parseInt(colB)) + valA * valB
            );
          }
        }
      }
    }

    return result;
  }
}

module.exports = SparseMatrix;
