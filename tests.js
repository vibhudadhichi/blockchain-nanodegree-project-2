(function test(){
	console.log("--- creating BlockchainDb instance, which is level DB wrapper.");
	let db = new BlockchainDb("./db");
	console.log("--- creating bc instance and injecting db intance to it.");
	let bc = new Blockchain(db);
	console.log("--- setting test constants.");
	const TOTAL_BLOCKS = 20;
	const ASYNC_WAIT_INTERVAL = 300;
	const INVALID_BLOCK_HEIGHTS = [4, 9, 13];
	
	console.log("--- adding 20 blocks to the chain. 21 blocks total. 20 is the height of the latest block.");
	for(let i = 1; i <= TOTAL_BLOCKS; i++) {
		let b = new Block("simple " + i);
		setTimeout(() => {
			bc.addBlock(b);
		}, i * ASYNC_WAIT_INTERVAL);
	}
	setTimeout(() => {
		console.log("--- at this point the chain is valid => validateChain must log success message.");
        bc.validateChain()
            .then(status => {
                // console.log(status);
                console.log("chain is valid");
            })
            .catch(errors => {
                console.log("chain is invalid");
                errors.forEach(e => console.log(e));
            });
	}, (TOTAL_BLOCKS + 1) * ASYNC_WAIT_INTERVAL);
	setTimeout(() => {
		console.log("--- invalidating some blocks in the chain to test validation.");
		INVALID_BLOCK_HEIGHTS.forEach(index => {
			console.log(`hacking block at ${index}`);
			bc.getChain().getBlock(index).then(block => {
				block.body = `invalid block ${index}`;
				return bc.getChain().getDb().put(index, JSON.stringify(block));
			}).then(result => {
				console.log(`block hacked`);
			}).catch(err => {
				console.log(err);
			});
		});
	}, (TOTAL_BLOCKS + 2) * ASYNC_WAIT_INTERVAL);
	setTimeout(() => {
		console.log("--- at this point chain has 3 invalid blocks. => validateChain must return array with errors");
		bc.validateChain()
			.then(status => {
				// console.log(status);
				console.log("chain is valid");
			})
			.catch(errors => {
                console.log("chain is invalid");
                errors.forEach(e => console.log(e.message));
			});
	}, (TOTAL_BLOCKS + 3) * ASYNC_WAIT_INTERVAL);
})();