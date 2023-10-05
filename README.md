enf-eosjs ![npm](https://img.shields.io/npm/dw/enf-eosjs.svg)

## <span style="color:#ffe200">⚠ enf-eosjs is deprecated</span> please use [WharfKit](https://github.com/wharfkit/) as the latest EOS SDK. For a basic SDK similar to eosjs check out [WharfKit Antelope](https://github.com/wharfkit/antelope)

## Installation

### NPM

[enf-eosjs](https://www.npmjs.com/package/enf-eosjs) has been updated to support latest features in EOS blockchain. This is an updated version of the popular eosjs package.  

### NodeJS Dependency

`npm install enf-eosjs`

### Using with Typescript

If you're using Node (not a browser) then you'll also need to make sure the `dom` lib is referenced in your `tsconfig.json`:

```
{
	"compilerOptions": {
		"lib": [..., "dom"]
	}
}
```

### Browser Distribution

Clone this repository locally then run `npm run build-web`.  The browser distribution will be located in `dist-web` and can be directly copied into your project repository. The `dist-web` folder contains minified bundles ready for production, along with source mapped versions of the library for debugging.

## Getting Started 

Very simple example of using **enf-eosjs**. Included unused imports as examples. 

```shell
npm init es6
npm install enf-eosjs 
node node_test
```

```js
/*
 * @module test_enf_eosjs
 * PUT THIS INTO A FILE NAMED node_test.js
 */

import { Api, JsonRpc, RpcError } from 'enf-eosjs';
import fetch from 'node-fetch'

const rpc = new JsonRpc('https://localhost:443', { fetch });
const api = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

var info = await rpc.get_info();

console.log(info);
```

## Import

### Signature Providers

It best to use a secure well supported secret store. Some examples of providers include:
* Azure Key Vault
* Hashicorp Vault
* Google Cloud Secret Manager
* AWS Secrets Management 

*JsSignatureProvider* is included as an example, and it is not provided by enf-eosjs. 

### ES Modules

Importing using ES6 module syntax in the browser is supported if you have a transpiler, such as Babel.
```js
import { Api, JsonRpc, RpcError } from 'enf-eosjs';
import { JsSignatureProvider } from 'enf-eosjs/dist/eosjs-jssig';           // development only
```

### CommonJS

Importing using commonJS syntax is supported by NodeJS out of the box.
```js
const { Api, JsonRpc, RpcError } = require('enf-eosjs');
const fetch = require('node-fetch');                                    // node only; not needed in browsers
```

## Basic Usage

### Signature Provider

The Signature Provider holds private keys and is responsible for signing transactions.

***Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production***

```js
const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // bob
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
```

### JSON-RPC

Open a connection to JSON-RPC, include `fetch` when on NodeJS.
```js
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
```

### API

No longer need to include textDecoder and textEncoder when using in Node, React Native, IE11 or Edge Browsers.
```js
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
```

### Sending a transaction

`transact()` is used to sign and push transactions onto the blockchain with an optional configuration object parameter.  This parameter can override the default value of `broadcast: true`, and can be used to fill TAPOS fields given `blocksBehind` and `expireSeconds`.  Given no configuration options, transactions are expected to be unpacked with TAPOS fields (`expiration`, `ref_block_num`, `ref_block_prefix`) and will automatically be broadcast onto the chain.

With the introduction of Leap v3.1 the retry transaction feature also adds 5 new optional fields to the configuration object:

- `useOldRPC`: use old RPC `push_transaction`, rather than new RPC send_transaction
- `useOldSendRPC`: use old RPC `/v1/chain/send_transaction`, rather than new RPC `/v1/chain/send_transaction2`
- `returnFailureTrace`: return partial traces on failed transactions
- `retryTrxNumBlocks`: request node to retry transaction until in a block of given height, blocking call
- `retryIrreversible`: request node to retry transaction until it is irreversible or expires, blocking call

```js
(async () => {
  const result = await api.transact({
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        to: 'useraaaaaaab',
        quantity: '0.0001 SYS',
        memo: '',
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  });
  console.dir(result);
})();
```

### Read Only Transactions 
Leap 4.0 introduced read only transaction. A read-only transaction does not change the state and is not added into the blockchain. It is useful for users to retrieve complex chain information.

```js
/*
 * Read Only transaciton can not modify state
 * In this example a special read only action in a custom contract is executed
 * Note the empty fields for authoriziation and data. 
 */
const readonlyTransfer = async () =>
    await api.transact(
        {
            actions: [
                {
                    account: testActor,
                    name: 'getvalue',
                    authorization: [],
                    data: {},
                },
            ],
        },
        {
            broadcast: true,
            readOnly: true,
            blocksBehind: 3,
            expireSeconds: 72,
        }
    )
// execute the read only transaction 
const transactionReadOnlyResponse = await readonlyTransfer();
// processed.receipt has status,cpu_usage_us,net_usage_words
console.log(`Transaction Id ${transactionReadOnlyResponse.transaction_id} CPU Usage ${transactionReadOnlyResponse.processed.receipt.cpu_usage_us}`)
```

### Error handling

use `RpcError` for handling RPC Errors
```js
...
try {
  const result = await api.transact({
  ...
} catch (e) {
  console.log('\nCaught exception: ' + e);
  if (e instanceof RpcError)
    console.log(JSON.stringify(e.json, null, 2));
}
...
```

## Contributing

[Contributing Guide](./CONTRIBUTING.md)

[Code of Conduct](./CONTRIBUTING.md#conduct)

## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms. This work is made on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation. Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.  Any person using or offering this software in connection with providing software, goods or services to third parties shall advise such third parties of these license terms, disclaimers and exclusions of liability.  Block.one, EOSIO, EOSIO Labs, EOS, EOS Network Foundation.

Wallets and related components are complex software that require the highest levels of security.  If incorrectly built or used, they may compromise users’ private keys and digital assets. Wallet applications and related components should undergo thorough security evaluations before being used.  Only experienced developers should work with this software.
