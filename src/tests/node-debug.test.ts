const debugTest = require('./node-debug');

describe('Node JS environment', () => {
    let transactionResponse: any;
    let transactionSignatures: any;

    it('read only transaction', async () => {
        transactionSignatures = await debugTest.readonlyTransfer();
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });
});
