const tests = require('./node');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const sleepToAvoidDuplicatesInSameBlock = tests.config.sleep;

describe('Node JS environment', () => {
    let transactionResponse: any;
    let transactionSignatures: any;
    let failedAsPlanned: boolean;

    it('transacts with configuration object', async () => {
        transactionResponse = await tests.transactWithConfig();
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('read only transaction', async () => {
        transactionResponse = await tests.readonlyTransfer();
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
        expect(Object.keys(transactionResponse.processed.receipt)).toContain('cpu_usage_us');
    });

    it('transacts with manually configured TAPOS fields', async () => {
        // needed for local tests to avoid duplicate transactions in same block
        if (sleepToAvoidDuplicatesInSameBlock) await sleep(700)
        transactionResponse = await tests.transactWithoutConfig();
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    }, 10000);

    it('transacts without broadcasting, returning signatures and packed transaction', async () => {
        transactionSignatures = await tests.transactWithoutBroadcast();
        expect(Object.keys(transactionSignatures)).toContain('signatures');
        expect(Object.keys(transactionSignatures)).toContain('serializedTransaction');
    });

    it('broadcasts packed transaction, given valid signatures', async () => {
        // needed for local tests to avoid duplicate transactions in same block
        if (sleepToAvoidDuplicatesInSameBlock) await sleep(700)
        transactionSignatures = await tests.transactWithoutBroadcast();
        transactionResponse = await tests.broadcastResult(transactionSignatures);
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('retry transaction', async () => {
        // needed for local tests to avoid duplicate transactions in same block
        if (sleepToAvoidDuplicatesInSameBlock) await sleep(700)
        transactionSignatures = await tests.transactWithRetry();
        transactionResponse = await tests.broadcastResult(transactionSignatures);
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('retry transaction irreversible', async () => {
        // needed for local tests to avoid duplicate transaction in same block
        await sleep(700)
        transactionSignatures = await tests.transactWithRetryIrreversible();
        transactionResponse = await tests.broadcastResult(transactionSignatures);
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });

    it('throws appropriate error message without configuration object or TAPOS in place', async () => {
        try {
            failedAsPlanned = true;
            await tests.transactShouldFail();
            failedAsPlanned = false;
        } catch (e) {
            if (e.message !== 'Required configuration or TAPOS fields are not present') {
                failedAsPlanned = false;
            }
        }
        expect(failedAsPlanned).toEqual(true);
    });

    it('throws an an error with RpcError structure for invalid RPC calls', async () => {
        try {
            failedAsPlanned = true;
            await tests.rpcShouldFail();
            failedAsPlanned = false;
        } catch (e) {
            if (!e.json || !e.json.error || !(e.json.error.hasOwnProperty('details'))) {
                failedAsPlanned = false;
            }
        }
        expect(failedAsPlanned).toEqual(true);
    });
});
