# Legion Gasless SDK

A Solana Gasless Transaction SDK that lets your end users sign and submit transactions **without holding any SOL**. Your backend sponsor wallet pays the network gas fee, and the SDK collects a small fee from the user in an SPL token (USDC, USDT, or any token you configure).

> Built and maintained by the [Legion](https://legiontx.com) team.

---

## ✨ Features

- ✅ Users transact with **0 SOL** in their wallet
- ✅ Sponsor wallet pays gas, you get reimbursed in **SPL tokens**
- ✅ **Atomic bundling** — fee + user instruction in a single transaction
- ✅ Add **any SPL token** as a fee option (just drop in the mint address)
- ✅ Auto-creates the user's Associated Token Account if missing
- ✅ Clean, typed, drop-in API

---

## 📦 Install

```bash
git clone https://github.com/MELcodes99/Legion-SDK.git
cd Legion-SDK
npm install
```

---

## 🔑 1. Add your sponsor wallet

The sponsor wallet pays SOL gas fees for every transaction. You fund it once, and it gets replenished by the SPL fees you collect from users.

Export a Solana keypair as a JSON array (e.g. from `solana-keygen new --outfile sponsor-wallet.json` or by exporting from Phantom) and save it to the project root as:

```
sponsor-wallet.json

## How to create sponsor-wallet.json
In your project folder run:
nano sponsor-wallet.json
Paste the array inside the file, then press Control + X, then Y, then Enter to save.

Confirm the file was created
cat sponsor-wallet.json
You should see your array printed out.
```

It should look like:

```json
[174,47,154,16,73,192,181,104, ... 64 numbers total]
```

## How to get your Wallet JSON Array

On Windows (Command Prompt or PowerShell)

Install Node.js from nodejs.org if you do not have it
Open Command Prompt or PowerShell
Run this command, replacing YOUR PRIVATE KEY with your actual key:

Command 1 - Install the correct bs58 version
npm install bs58@4.0.1

Command 2 - Open the file
nano convert.js

Command 3 - You will see a blank screen, paste this exact code

const bs58 = require('bs58');

const key = 'YOURPRIVATEKEY';

const decoded = Buffer.from(bs58.decode(key));

const fs = require('fs');

fs.writeFileSync('sponsor-wallet.json', JSON.stringify(Array.from(decoded)));

console.log('sponsor-wallet.json created successfully!');

Replace YOURPRIVATEKEY with your actual private key. Keep the single quotes around it.

Command 4 - Save the file
Press Control and X at the same time, then press Y, then press Enter

Command 5 - Run the file
node convert.js

You will get your JSON Array


On Kali Linux or any Linux terminal

Make sure Node.js is installed. Run: sudo apt install nodejs npm
Install bs58: npm install bs58
Run this command, replacing YOUR PRIVATE KEY with your actual key:

Command 1 - Install the correct bs58 version
npm install bs58@4.0.1

Command 2 - Open the file
nano convert.js

Command 3 - You will see a blank screen, paste this exact code
const bs58 = require('bs58');
const key = 'YOURPRIVATEKEY';
const decoded = Buffer.from(bs58.decode(key));
const fs = require('fs');
fs.writeFileSync('sponsor-wallet.json', JSON.stringify(Array.from(decoded)));
console.log('sponsor-wallet.json created successfully!');
Replace YOURPRIVATEKEY with your actual private key. Keep the single quotes around it.

Command 4 - Save the file
Press Control and X at the same time, then press Y, then press Enter

Command 5 - Run the file
node convert.js

Alternative using Python (works on both)

Install the base58 library: pip install base58
Run this command:

python3 -c "import base58, json; print(json.dumps(list(base58.b58decode('YOURPRIVATEKEY'))))"



> ⚠️ **NEVER commit `sponsor-wallet.json` to git.** It is already in `.gitignore`.

Fund it with SOL:

```bash
solana transfer <sponsor-public-key> 0.5 --url mainnet-beta
```

The SDK will log a warning when the balance drops below 0.05 SOL.

---

## ⚙️ 2. Configure fee tokens

Edit `config.json`:

```json
{
  "rpcUrl": "https://api.mainnet-beta.solana.com",
  "gasless": {
    "fees": [
      {
        "token": "USDT",
        "mintAddress": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "amount": 0.10
      },
      {
        "token": "USDC",
        "mintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "amount": 0.05
      }
    ],
    "defaultFeeToken": "USDC"
  }
}
```

Add any SPL token by dropping in a new object with its mint address and the amount (in human units, e.g. `0.05` USDC) you want to charge per transaction.

---

## 🛠️ 3. Use it in your app

```ts
import { GaslessSDK } from "Legion-SDK";
import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

const sdk = new GaslessSDK(); // auto-loads ./config.json + ./sponsor-wallet.json

// Build any normal Solana transaction
const userInstruction = SystemProgram.transfer({
  fromPubkey: user.publicKey,
  toPubkey: new PublicKey("Recipient..."),
  lamports: 1_000,
});

const tx = new Transaction().add(userInstruction);

// Wrap it to make it gasless
const gaslessTx = await sdk.makeGasless({
  transaction: tx,
  userPublicKey: user.publicKey,
  feeToken: "USDC", // optional, falls back to defaultFeeToken
});

// User signs (no SOL required), then send
gaslessTx.partialSign(/* user keypair or wallet adapter */);
const signature = await sdk.sendAndConfirm(gaslessTx);
console.log("✅ Confirmed:", signature);
```
---

## 🔒 Safety

- Fee collection and the user's instruction are bundled into **one atomic transaction** — either everything succeeds or nothing happens.
- If the user has no token account for the chosen fee token, the SDK creates one (sponsor pays the rent).
- The sponsor wallet is set as the **fee payer** of the transaction.

---








## 📁 Project structure

```
gasless-sdk/
├── src/
│   ├── index.ts           # main SDK export
│   ├── gasless.ts         # core transaction wrapping logic
│   ├── fee-collector.ts   # SPL fee instruction builder
│   ├── wallet-loader.ts   # loads sponsor keypair from JSON
│   └── config.ts          # config loader + types
├── sponsor-wallet.json    # YOU add this (gitignored)
├── config.json
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## License

MIT
