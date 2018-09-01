# Udacity Blockchain Developer Nanodegree. Project 2
## simpleChain.js
Contains Block, Blockchain and BlockchainDb classes for project.
BlockchainDb is wrapper for LevelDB.
## tests.js
Contains the IIFE (immediately-invoked function expression) that tests the following:
1) creation of BlockchainDb and Blockchain instances
2) addition of 20 Blocks to Blockchain
3) successful validation of the Blockchain after addition of 20 blocks
4) invalidation script that hacks body of 3 blocks in the chain
5) failed validation of Blockchain after hack

## Project Spec Checklist
### Configure LevelDB to persist dataset
- [x] SimpleChain.js includes the Node.js level library and configured to persist
data within the project directory.

### Modify simpleChain.js functions to persist data with LevelDB
- [x] addBlock(newBlock) includes a method to store newBlock within LevelDB

- [x] Genesis block persist as the first block in the blockchain using LevelDB

### Modify validate functions
- [x] validateBlock() function to validate a block stored within levelDB
  
- [x] validateChain() function to validate blockchain stored within levelDB

### Modify getBlock() function
- [x] getBlock() function retrieves a block by block height within the LevelDB chain.

### Modify getBlockHeight() function
- [x] getBlockHeight() function retrieves current block height within the LevelDB chain.
