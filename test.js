const { sendGaslessTransaction } = require('./dist/index.js');
const fs = require('fs');
const sponsor = JSON.parse(fs.readFileSync('./sponsor-wallet.json', 'utf8'));
console.log('SDK loaded successfully');
console.log('Sponsor wallet loaded:', sponsor.length, 'bytes');
