const { JsonRpc, RpcError, Api } = require('../../dist');
const { JsSignatureProvider } = require('../../dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');

const privateKey = '5JJBHqug5hX1cH91R5u3oMiA3ncHYW395PPmHQbfUshJikGDCBv';
const testActor = 'hokieshokies'
const testRecipient = 'alicetestlio'
/* new accounts for testing can be created
 * see docs/5.-Testing and Building with DUNE.md
 *      OR  by unlocking a cleos wallet then calling:
 * 1) cleos create key --to-console (copy this privateKey & publicKey)
 * 2) cleos wallet import
 * 3) cleos create account bob publicKey
 * 4) cleos create account alice publicKey
 */

const rpc = new JsonRpc('http://127.0.0.1:8888/', { fetch });
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const transactWithConfig = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: testActor,
            permission: 'active',
        }],
        data: {
            from: testActor,
            to: testRecipient,
            quantity: '0.0001 EOS',
            memo: '',
        },
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30,
});

const transactWithoutConfig = async () => {
    const transactionResponse = await transactWithConfig();
    const blockInfo = await rpc.get_block(transactionResponse.processed.block_num - 3);
    const currentDate = new Date();
    const timePlusTen = currentDate.getTime() + 10000;
    const timeInISOString = (new Date(timePlusTen)).toISOString();
    const expiration = timeInISOString.substring(0, timeInISOString.length - 1);

    return await api.transact({
        expiration,
        ref_block_num: blockInfo.block_num & 0xffff,
        ref_block_prefix: blockInfo.ref_block_prefix,
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: testActor,
                permission: 'active',
            }],
            data: {
                from: testActor,
                to: testRecipient,
                quantity: '0.0001 EOS',
                memo: '',
            },
        }]
    });
};


const transactWithoutBroadcast = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: testActor,
            permission: 'active',
        }],
        data: {
            from: testActor,
            to: testRecipient,
            quantity: '0.0001 EOS',
            memo: '',
        },
    }]
}, {
    broadcast: false,
    blocksBehind: 3,
    expireSeconds: 30,
});


const transactWithRetry = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: testActor,
            permission: 'active',
        }],
        data: {
            from: testActor,
            to: testRecipient,
            quantity: '0.0001 EOS',
            memo: '',
        },
    }]
}, {
    broadcast: false,
    blocksBehind: 3,
    expireSeconds: 30,
    retryTrxNumBlocks: 10
});

const transactWithRetryIrreversible = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: testActor,
            permission: 'active',
        }],
        data: {
            from: testActor,
            to: testRecipient,
            quantity: '0.0001 EOS',
            memo: '',
        },
    }]
}, {
    broadcast: false,
    blocksBehind: 3,
    expireSeconds: 30,
    retryIrreversible: true
});

const broadcastResult = async (signaturesAndPackedTransaction) => await api.pushSignedTransaction(signaturesAndPackedTransaction);

const transactShouldFail = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: testActor,
            permission: 'active',
        }],
        data: {
            from: testActor,
            to: testRecipient,
            quantity: '0.0001 EOS',
            memo: '',
        },
    }]
});

const rpcShouldFail = async () => await rpc.get_block(-1);

module.exports = {
    transactWithConfig,
    transactWithoutConfig,
    transactWithoutBroadcast,
    transactWithRetry,
    transactWithRetryIrreversible,
    broadcastResult,
    transactShouldFail,
    rpcShouldFail
};
