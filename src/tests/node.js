const { JsonRpc, RpcError, Api } = require('../../dist');
const { JsSignatureProvider } = require('../../dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
const { TestConfig, TestNet } = require('./TestConfig.ts');

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

// TestNet.Local or TestNet.Jungle sets endpoint, blocksBehind, and expireSeconds
const config = new TestConfig(TestNet.HomeBrew);
const rpc = new JsonRpc(config.endpoint, { fetch });
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
    blocksBehind: config.blocksBehind,
    searchBlocksAhead: config.searchBlockAhead,
    expireSeconds: config.expireSeconds,
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
    blocksBehind: config.blocksBehind,
    searchBlocksAhead: config.searchBlockAhead,
    expireSeconds: config.expireSeconds,
});


const transactWithRetry = async () =>
    await api.transact(
        {
            actions: [
                {
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [
                        {
                            actor: testActor,
                            permission: 'active',
                        }],
                    data: {
                        from: testActor,
                        to: testRecipient,
                        quantity: '0.0001 EOS',
                        memo: '',
                    },
                }],
        },
        {
            broadcast: false,
            blocksBehind: config.blocksBehind,
            searchBlocksAhead: config.searchBlockAhead,
            expireSeconds: config.expireSeconds,
            retryTrxNumBlocks: 10,
        }
    )

const transactWithRetryIrreversible = async () =>
    await api.transact(
        {
            actions: [
                {
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [
                        {
                            actor: testActor,
                            permission: 'active',
                        }],
                    data: {
                        from: testActor,
                        to: testRecipient,
                        quantity: '0.0001 EOS',
                        memo: '',
                    },
                }],
        },
        {
            broadcast: false,
            blocksBehind: config.blocksBehind,
            searchBlocksAhead: config.searchBlockAhead,
            expireSeconds: config.expireSeconds,
            retryIrreversible: true,
        }
    )

// change this to read
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
            blocksBehind: config.blocksBehind,
            searchBlocksAhead: config.searchBlockAhead,
            expireSeconds: config.expireSeconds,
        }
    )

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
    readonlyTransfer,
    broadcastResult,
    transactShouldFail,
    rpcShouldFail,
    config,
};
