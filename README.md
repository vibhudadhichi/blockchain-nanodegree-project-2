# Testing
1. Download the .zip with the project files.
2. Unzip into any folder on your computer.
3. Open Terminal and go to this folder.
4. Run `npm install` in the folder to install the dependencies.
5. Run `node` to launch Node.js REPL.
6. Run `.load simpleChain.js` to load the project classes.

__Now there are two options to proceed:__
1. Test using tests.js script, which contains the following scenarios:
    1) creation of BlockchainDb and Blockchain instances
    2) addition of 20 Blocks to Blockchain __asynchronously(!)__
    3) successful validation of the Blockchain instance after addition of 20 blocks
    4) invalidation script that hacks body of 3 blocks in the Blockchain instance
    5) failed validation of the Blockchain after hack
2. Test using individual Node.js REPL commands

## IMPORTANT! Read before proceeding with any Test Option.
All Blockchain class methods, including `addBlock(block)` method, are now async and 
return Promise.

It means, the below `for` loop, which was provided in the project
input README.md, __does not work anymore__.
``` 
// BELOW CODE IS SYNC!
// It will fail to populate the blocks in the Blockchain, because addBlock(block) is async now.
// 5: Generate 10 blocks using a for loop
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
Instead, you need to use `for` loop to populate the blocks in the Blockchain that 
takes into account the async nature of `addBlock(block)`. Like:
``` 
const TOTAL_BLOCKS = 20;
const ASYNC_WAIT_INTERVAL = 300;
for(let i = 1; i <= TOTAL_BLOCKS; i++) {
    let b = new Block("simple " + i);
    setTimeout(() => {
        bc.addBlock(b);
    }, i * ASYNC_WAIT_INTERVAL);
```

Or you can add blocks one-by-one. Like:
``` 
> blockchain.addBlock(new Block("test block 1"));
> blockchain.addBlock(new Block("test block 2"));
> blockchain.addBlock(new Block("test block 3"));
> blockchain.addBlock(new Block("test block 4"));
> blockchain.addBlock(new Block("test block 5"));
```
## Option 1. E2E testing with tests.js file
Load the tests.js file.
```
> .load tests.js
```
It contains IIFE that will run the tests.
Check output of the logs then.

## Option 2. Testing individual methods of Blockchain instance
1. Create Blockchain instance:
```
> let blockchain = new Blockchain();
```

2. Now you can test individual methods of Blockchain instance:

`addBlock(block)` will return Promise, that resolves to created Block
```
> blockchain.addBlock(new Block("test block")).then(result => console.log(result)).catch(err => console.log(err.message));
```
`getBlock(blockHeight)` will return Promise that resolves to the Block of provided height.
``` 
> blockchain.getBlock(1).then(block => console.log(block)).catch(err => console.log(err.message));
```
`getBlockHeight()` will return Promise, that resolves into the current height of the Blockchain.
``` 
> blockchain.getBlockHeight().then(height => console.log(height)).catch(err => console.log(err.message));
```
`validateBlock(blockHeight)` will return Promise, that resolves to `true`, when the Block of provided height is valid
``` 
> blockchain.validateBlock(1).then(isValid => console.log(isValid)).catch(err => console.log(err.message));
```
`validateChain()` will return Promise, that resolves to `true`, when the full chain is valid or rejects with
errors, indicating each failed Block.
```
> blockchain.validateChain().then(isValid => console.log(isValid)).catch(err => console.log(err.message));
```

3. To hack some blocks in the `blockchain`, you can execute this script in Node.js REPL.

__Block heights, specified in `invalidBlocks` must exist in the chain.
Otherwise the script will fail.__
```
> let invalidBlockHeights = [1,2,5];
> invalidBlockHeights.forEach(index => {
    console.log(`hacking block at ${index}`);
    blockchain.getChain().getBlock(index).then(block => {
        block.body = `invalid block ${index}`;
        return blockchain.getChain().getDb().put(index, JSON.stringify(block));
    }).then(result => {
        console.log(`block hacked`);
    }).catch(err => {
        console.log(err);
    });
});
```
Once blocks are hacked, try to call:
```
> blockchain.validateChain().then(isValid => console.log(isValid)).catch(err => console.log(err));
```
It will log validation errors, indicating each Block that failed validation.
