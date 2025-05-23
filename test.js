const assert = require('assert');
const fs = require('fs');
const SparseMatrix = require('./src/sparseMatrix');

function testAddition() {
  const m1 = new SparseMatrix(2, 2);
  m1.set(0, 0, 1);
  m1.set(1, 1, 1);
  
  const m2 = new SparseMatrix(2, 2);
  m2.set(0, 1, 1);
  m2.set(1, 0, 1);
  
  const result = SparseMatrix.add(m1, m2);
  assert.equal(result.get(0, 0), 1);
  assert.equal(result.get(0, 1), 1);
  assert.equal(result.get(1, 0), 1);
  assert.equal(result.get(1, 1), 1);
}

testAddition();
console.log("All tests passed!");
