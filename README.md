# Udacity Blockchain Developer Nanodegree. Project 2
## How to test?
Download the .zip with the project files.

Unzip into any folder on your computer.

Open Terminal and go to this folder.

Run `npm install` in the folder to install the dependencies.
### E2E testing with tests.js file
In project directory run ```node``` to open Node.js REPL.

In Node.js REPL load the classes in simpleChain.js first:
```
> .load simpleChain.js
```
Then load the tests.js file. It contains IIFE that will run the tests script:
```
> .load tests.js
```
Last command will run the IIFE in tests.js.
Check output of the logs then.
### Testing individual methods of Blockchain instance
In project directory run ```node``` to open Node.js REPL.
In Node.js REPL load the classes in simpleChain.js first:
```
> .load simpleChain.js
```
Now you need to create the instance of the BlockchainDb and specify the directory, where
LevelDB will store data.
```
> let db = new BlockchainDb("./db");
```
If directory is not empty, BlockchainDb class will read the 
existing data from existing LevelDB directory.

> If you need to start empty Blockchain in the same directory, you can delete existing data.
For that just delete the` dbDir` directory, that you specified in the `new BlockchainDb(dbDir)` call.

Now you are ready to create Blockchain instance, using BlockchainDb instance:
```
> let blockchain = new Blockchain(db);
```

Now you can test individual methods of Blockchain instance:
```
> blockchain.addBlock(new Block("test block");
> blockchain.getBlock(1);
> blockchain.getBlockHeight();
> blockchain.validateBlock(1);
> blockchain.validateChain();
```

To hack some blocks in the `blockchain`, you can execute this script. 

__Block heights, specified in `invalidBlocks` must exist in the chain.
Otherwise the script will fail.__
```ecmascript 6
let invalidBlockHeights = [1,2,5];
invalidBlockHeights.forEach(index => {
    log(`hacking block at ${index}`);
    blockchain.db.getBlock(index).then(block => {
        block.body = `invalid block ${index}`;
        return blockchain.db.db.put(index, JSON.stringify(block));
    }).then(result => {
        log(`block hacked`);
    }).catch(err => {
        log(err);
    });
});
```
Once blocks are hacked, try to call
```
> blockchain.validateChain();
```
It will log validation errors and provide the heights of invalid blocks.

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
