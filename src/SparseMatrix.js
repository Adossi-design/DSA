import fs from 'fs';

class SparseMatrix {
  constructor(numRows, numCols) {
    this.rows = numRows;
    this.cols = numCols;
    this.data = new Map(); // {row: Map{col: value}}
  }

  static async fromFile(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, "utf8");
      const lines = content.split("\n").filter(line => line.trim());

      // Parse dimensions
      const rows = parseInt(lines[0].substring(5));
      const cols = parseInt(lines[1].substring(5));
      
      // Validate dimensions
      if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        throw new Error(`Invalid matrix dimensions: rows=${rows}, cols=${cols}`);
      }

      const matrix = new SparseMatrix(rows, cols);

      // Parse matrix entries with bounds checking
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [row, col, value] = line.slice(1, -1).split(',').map(x => parseInt(x.trim()));
        
        // Skip invalid entries instead of throwing errors
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
          matrix.setElement(row, col, value);
        } else {
          console.warn(`Skipping invalid position: (${row},${col}) in ${rows}x${cols} matrix`);
        }
      }

      return matrix;
    } catch (error) {
      throw new Error(`Failed to read matrix file: ${filePath}\n${error.message}`);
    }
  }

  getElement(row, col) {
    const rowData = this.data.get(row);
    return rowData ? rowData.get(col) || 0 : 0;
  }

  setElement(row, col, value) {
    if (value === 0) {
      const rowData = this.data.get(row);
      if (rowData) {
        rowData.delete(col);
        if (rowData.size === 0) {
          this.data.delete(row);
        }
      }
    } else {
      if (!this.data.has(row)) {
        this.data.set(row, new Map());
      }
      this.data.get(row).set(col, value);
    }
  }

  add(other) {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error(`Matrix dimensions must match for addition (${this.rows}x${this.cols} vs ${other.rows}x${other.cols})`);
    }

    const result = new SparseMatrix(this.rows, this.cols);

    // Add elements from both matrices
    const allRows = new Set([...this.data.keys(), ...other.data.keys()]);
    for (const row of allRows) {
      const cols = new Set([
        ...(this.data.get(row)?.keys() || []),
        ...(other.data.get(row)?.keys() || [])
      ]);
      
      for (const col of cols) {
        result.setElement(row, col, this.getElement(row, col) + other.getElement(row, col));
      }
    }

    return result;
  }

  subtract(other) {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error(`Matrix dimensions must match for subtraction (${this.rows}x${this.cols} vs ${other.rows}x${other.cols})`);
    }

    const result = new SparseMatrix(this.rows, this.cols);

    // Subtract elements from both matrices
    const allRows = new Set([...this.data.keys(), ...other.data.keys()]);
    for (const row of allRows) {
      const cols = new Set([
        ...(this.data.get(row)?.keys() || []),
        ...(other.data.get(row)?.keys() || [])
      ]);
      
      for (const col of cols) {
        result.setElement(row, col, this.getElement(row, col) - other.getElement(row, col));
      }
    }

    return result;
  }

  multiply(other) {
    if (this.cols !== other.rows) {
      throw new Error(`Invalid dimensions for multiplication: ${this.rows}x${this.cols} * ${other.rows}x${other.cols}`);
    }

    const result = new SparseMatrix(this.rows, other.cols);

    // Efficient multiplication using only non-zero elements
    for (const [i, rowData] of this.data) {
      for (const [k, aVal] of rowData) {
        if (other.data.has(k)) {
          for (const [j, bVal] of other.data.get(k)) {
            result.setElement(i, j, result.getElement(i, j) + aVal * bVal);
          }
        }
      }
    }

    return result;
  }

  toString() {
    let result = `rows=${this.rows}\ncols=${this.cols}\n`;
    for (const [row, rowData] of this.data) {
      for (const [col, value] of rowData) {
        result += `(${row}, ${col}, ${value})\n`;
      }
    }
    return result;
  }
}

export default SparseMatrix;
