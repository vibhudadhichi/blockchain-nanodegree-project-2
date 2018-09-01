/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');

/* ===== Persistent Key-value store with level DB ============
|                                                            |
|  =========================================================*/
const level = require('level');
/* ===== console.log wrapper =======================
|  Wrapper for console.log.                        |
|  ===============================================*/
function log(message) {
    console.log(`LOG: ${message}\n`);
}

/* ===== BlockchainDb Class ========================
|  Wrapper for leveldb.                            |
|  ===============================================*/
class BlockchainDb {
    constructor(dbDir) {
        this.db = level(dbDir);
    }
    saveBlock(block) {
        let _this = this;
        let key = block.height;
        return new Promise(function(resolve, reject) {
            _this.db.put(key, JSON.stringify(block), function(err){
                if(err) {
                    log('Block ' + key + ' submission failed\n'+ err);
                    resolve(false);
                }
                resolve(true);
            })
        });
    }
    getBlock(key) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            _this.db.get(key, function(err, value) {
                if(err) {
                    log("Can not get Block at key=" + key);
                    reject(err);
                }
                // log(`block at index ${key} is:\n${value}`);
                resolve(JSON.parse(value));
            });
        });
    }
    getChainLength() {
        let _this = this;
        return new Promise(function(resolve, reject){
            let length = 0;
            _this.db.createReadStream({ keys: true, values: false })
                .on('data', function (data) {
                    length++;
                })
                .on('error', function(err) {
                    log(err);
                    reject(err);
                })
                .on('close', function(){
                    resolve(length);
                });
        });
    }
    isEmpty() {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let length = _this.getChainLength();
            length.then(result => {
                if(result === 0) {
                    log("DB is empty");
                    resolve(true);
                } else {
                    log("DB is not empty");
                    resolve(false);
                }
            });
        });
    }
}

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
    constructor(data){
        this.hash = "";
        this.height = 0;
        this.body = data;
        this.time = 0;
        this.previousBlockHash = "";
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
    constructor(db){
        this.db = db;
        db.isEmpty().then(result => {
            if(result) {
                log("Blockchain DB is empty. Creating new Blockchain with 1 genesis block...");
                this.addBlock(new Block("First block in the chain - Genesis block"));
            } else {
                log("Blockchain DB has blocks. Reading Blockchain from DB...");
            }
        }).catch(err => {
            log(err);
        });
    }

    addBlock(newBlock){
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        this.db.getChainLength().then(chainLength => {
            newBlock.height = chainLength;
            if(chainLength === 0) {
                return new Promise((resolve, reject) => {
                    log("chain length = 0, return null instead of block");
                    resolve(null);
                });
            } else {
                log(`chain length is ${chainLength}, return previous block`);
                return this.db.getBlock(chainLength - 1);
            }
        }).then(previousBlock => {
            if(previousBlock === null) {
                newBlock.previousBlockHash = "";
            } else {
                newBlock.previousBlockHash = previousBlock.hash;
            }
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            return this.db.saveBlock(newBlock);
        }).then(saveOperationResult => {
            if(saveOperationResult === true) {
                log("block saved");
            } else {
                log("block is not saved");
            }
        }).catch(err => {
            log(err);
        });
    }

    getBlockHeight() {
        this.db.getChainLength().then(currentLength => {
            return currentLength;
        }).catch(err => {
            log(err);
        });
    }

    getBlock(blockHeight){
        this.db.getBlock(blockHeight).then(block => {
            log(JSON.stringify(block));
            return block;
        }).catch(err => {
            log(err);
        });
    }

    validateBlock(blockHeight){
        let _this = this;
        return new Promise(function(resolve, reject){
            _this.db.getBlock(blockHeight).then(block => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve(true);
                } else {
                    log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                    resolve(false);
                }
            });
        });
    }

    validateChain() {
        let allBlocks = [];
        let _this = this;
        this.db.getChainLength().then(currentLength => {
            for(let i = 0; i < currentLength; i++) {
                allBlocks.push(_this.validateBlock(i));
            }
            return Promise.all(allBlocks);
        }).then(validationResults => {
            let errors = [];
            validationResults.forEach((validation, index) => {
                if(validation === false) errors.push(index);
            });
            if(errors.length === 0) {
                log(`${validationResults.length} blocks checked. Chain is valid.`);
            } else {
                log(`Chain is invalid. Invalid blocks heights are: ${errors}`);
            }
        }).catch(err => {
            log(err);
        });
    }
}