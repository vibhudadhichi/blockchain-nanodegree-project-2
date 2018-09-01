(function test(){
	log("--- creating BlockchainDb instance, which is level DB wrapper.");
	let db = new BlockchainDb("./db");
	log("--- creating bc instance and injecting db intance to it.");
	let bc = new Blockchain(db);
	log("--- setting test constants.");
	const TOTAL_BLOCKS = 20;
	const ASYNC_WAIT_INTERVAL = 300;
	const INVALID_BLOCK_HEIGHTS = [4, 9, 13];
	
	log("--- adding 20 blocks to the chain. 21 blocks total. 20 is the height of the latest block.")
	for(let i = 1; i <= TOTAL_BLOCKS; i++) {
		let b = new Block("simple " + i);
		setTimeout(() => {
			bc.addBlock(b);
		}, i * ASYNC_WAIT_INTERVAL);
	}
	setTimeout(() => {
		log("--- at this point the chain is valid => validateChain must log success message.");
		bc.validateChain();
	}, (TOTAL_BLOCKS + 1) * ASYNC_WAIT_INTERVAL);
	setTimeout(() => {
		log("--- invalidating some blocks in the chain to test validation.");
		INVALID_BLOCK_HEIGHTS.forEach(index => {
			log(`hacking block at ${index}`);
			bc.db.getBlock(index).then(block => {
				block.body = `invalid block ${index}`;
				return bc.db.db.put(index, JSON.stringify(block));
			}).then(result => {
				log(`block hacked`);
			}).catch(err => {
				log(err);
			});
		});
	}, (TOTAL_BLOCKS + 2) * ASYNC_WAIT_INTERVAL);
	setTimeout(() => {
		log("--- at this point chain has 3 invalid blocks. => validateChain must log error message");
		bc.validateChain();
	}, (TOTAL_BLOCKS + 3) * ASYNC_WAIT_INTERVAL);
})();