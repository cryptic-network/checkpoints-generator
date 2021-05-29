const fetch = require('node-fetch');

const daemon_address  = 'seed1.crypticnetwork.cf:17941';

const steps           = 100;
const startHeight     = 0;
const endHeight       = 4800;
const maxHeight       = true; // Put this on true to find last block on the chain
const outputForCode   = true; // Put this on true to get checkpoints for the codebase (CryptoNoteCheckpoints.h)

(async () => {
  // Get hash from daemon
  async function getBlockHash(height) {
    const rawResponse = await fetch('http://' + daemon_address + '/json_rpc', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: `{"jsonrpc":"2.0","id":"blockbyheight","method":"getblockheaderbyheight","params":{"height":${height}}}`
    });
    const content = await rawResponse.json();
    
    return await content.result.block_header.hash;
  }

  // Get last block count
  async function getLastBlock(height) {
    const rawResponse = await fetch('http://' + daemon_address + '/info', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const content = await rawResponse.json();
    
    return await content.network_height;
  }

  if(outputForCode) {
    console.log(`const std::initializer_list<CheckpointData> CHECKPOINTS = {`);
    for(let i = startHeight; i < (maxHeight ? await getLastBlock() : endHeight); i+=steps) {
      console.log(`    {${i},${new Array(8 - i.toString().length).join(' ')}"${await getBlockHash(i)}"},`);
    }
    console.log(`};`)
  }

})();