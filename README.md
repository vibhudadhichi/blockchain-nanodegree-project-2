# Udacity Blockchain Developer Nanodegree. Project 2
## simpleChain.js
Contains Block, Blockchain and BlockchainDB classes for project.
BlockchainDb is wrapper for level DB.
## tests.js
Contains the IIFE (immediately-invoked function expression) that tests the following:
1) creation of BlockchainDb and Blockchain instances
2) addition of 20 Blocks to Blockchain
3) validation of the Blockchain after addition of 20 blocks
4) invalidation script that hacks body of 3 blocks in the chain
5) validation of Blockchain after hack