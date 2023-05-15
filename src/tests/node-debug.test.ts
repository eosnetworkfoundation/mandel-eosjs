const debugTest = require('./node.test');

describe('Node JS environment', () => {
    let transactionResponse: any;

    it('transacts with configuration object', async () => {
        transactionResponse = await debugTest.transactWithConfig();
        expect(Object.keys(transactionResponse)).toContain('transaction_id');
    });
});
