# Sparse Matrix Operations

This program performs operations on sparse matrices loaded from text files.

## How to Use

1. Place your matrix files in the `sample_inputs/` folder
2. Run the program:
   ```bash
   node main.js
   ```
3. Check results in the `results/` folder

## File Format

Matrix files must follow this format:
```
rows=<number>
cols=<number>
(row,col,value)
(row,col,value)
...
```

## Example

For files `sample_inputs/easy_sample_01_1.txt` and `sample_inputs/easy_sample_01_2.txt`, the program will create:
- `results/addition.txt`
- `results/multiplication.txt`
