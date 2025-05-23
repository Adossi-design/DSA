const testPairs = [
  ['01_2', '01_3'],
  ['02_1', '02_2'],
  ['03_1', '03_2']
];

async function testAll() {
  for (const [file1, file2] of testPairs) {
    console.log(`\nTesting ${file1} and ${file2}`);
    
    const m1 = SparseMatrix.fromString(
      fs.readFileSync(`sample_inputs/easy_sample_${file1}.txt`, 'utf8')
    );
    const m2 = SparseMatrix.fromString(
      fs.readFileSync(`sample_inputs/easy_sample_${file2}.txt`, 'utf8')
    );

    // Addition
    fs.writeFileSync(
      `results/add_${file1}_${file2}.txt`,
      SparseMatrix.add(m1, m2).toString()
    );

    // Multiplication
    try {
      fs.writeFileSync(
        `results/mult_${file1}_${file2}.txt`,
        SparseMatrix.multiply(m1, m2).toString()
      );
    } catch (e) {
      console.log(`Couldn't multiply ${file1} and ${file2}: ${e.message}`);
    }
  }
}

testAll();
