const { PayFast } = require('../lib/payfast');

const config = {
    merchant_id: '10004305',
    merchant_key: '3ecue3ddukkm7',
    passphrase: 'qwertyqwerty',
    environment: 'testing'
};

const paymentData = {
    return_url: 'https://www.someurl.com/success',
    cancel_url: 'https://www.someurl.com/cancel',
    notify_url: 'https://www.someurl.com/notify',
    name_first: 'John',
    name_last: 'Doe',
    email_address: 'john@doe.com',
    amount: '300.00', // required
    item_name: 'Cheese', // required
    item_description: '1 block of cheese'
}

describe('PayFast', () => {
    let payfast;

    beforeEach(() => {
        payfast = new PayFast(config);
    });

    afterEach(() => {
        payfast = null;
    });

    describe('config', () => {
        it('should have a config object', () => {
            expect(payfast.config).toBeDefined();
        });

        it('should have a merchant_id property', () => {
            expect(payfast.config.merchant_id).toEqual(config.merchant_id)
        });

        it('should have a merchant_key property', () => {
            expect(payfast.config.merchant_key).toEqual(config.merchant_key)
        });

        it('should have a passphrase property', () => {
            expect(payfast.config.passphrase).toEqual(config.passphrase)
        });
    });

    describe('getMerchantId', () => {
        it('should return the merchant_id', () => {
            expect(payfast.getMerchantId()).toEqual(config.merchant_id);
        });
    });

    describe('getMerchantKey', () => {
        it('should return the merchant_key', () => {
            expect(payfast.getMerchantKey()).toEqual(config.merchant_key);
        });
    });

    describe('getPassPhrase', () => {
        it('should return the passphrase', () => {
            expect(payfast.getPassPhrase()).toEqual(config.passphrase);
        });
    });

    describe('getApiUrl', () => {
        it('should return sandbox URL when environment is not production', () => {
            expect(payfast.getApiUrl()).toBe('https://sandbox.payfast.co.za');
        });

        it('should return production URL when sandbox is false', () => {
            payfast.setEnvironmentConfig('production');
            expect(payfast.getApiUrl()).toBe('https://www.payfast.co.za');
            payfast.setEnvironmentConfig('testing');
        });
    });


    describe('encodeURIString', () => {
        it('should return a correctly encoded string', () => {
            const testString = 'test string';
            const expectedString = 'test+string';

            expect(payfast.encodeURIString(testString)).toBe(expectedString);
        });
    });

    describe('createPaymentObject', () => {
        it('should return an object with the correct properties and values', async () => {
            const signature = 'test_signature';
            const expectedObject = {
                merchant_id: config.merchant_id,
                merchant_key: config.merchant_key,
                ...paymentData,
                signature: signature
            };

            await expect(await payfast.createPaymentObject(paymentData, signature)).toEqual(expectedObject);
        });
    });

    describe('createStringfromObject', () => {
        it('should return a correctly formatted string', async () => {
            const expectedString = new URLSearchParams();
            expectedString.append('merchant_id', config.merchant_id);
            expectedString.append('merchant_key', config.merchant_key);
            expectedString.append('return_url', paymentData.return_url);
            expectedString.append('cancel_url', paymentData.cancel_url);
            expectedString.append('notify_url', paymentData.notify_url);
            expectedString.append('name_first', paymentData.name_first);
            expectedString.append('name_last', paymentData.name_last);
            expectedString.append('email_address', paymentData.email_address);
            expectedString.append('amount', paymentData.amount);
            expectedString.append('item_name', paymentData.item_name);
            expectedString.append('item_description', paymentData.item_description);
            expectedString.append('passphrase', config.passphrase);
            await expect(await payfast.createStringfromObject(paymentData)).toBe(expectedString.toString());
        });
    });

    describe('createSignature', () => {
        it('should return a correct signature', () => {
            const testString = 'test_string';
            const expectedSignature = '3474851a3410906697ec77337df7aae4';

            expect(payfast.createSignature(testString)).toBe(expectedSignature);
        });
    });

    describe('generatePaymentUrl', () => {
        it('should return a payment URL', async () => {
            let paymentInfo = new URLSearchParams();
            paymentInfo.append('merchant_id', config.merchant_id);
            paymentInfo.append('merchant_key', config.merchant_key);
            paymentInfo.append('return_url', paymentData.return_url);
            paymentInfo.append('cancel_url', paymentData.cancel_url);
            paymentInfo.append('notify_url', paymentData.notify_url);
            paymentInfo.append('name_first', paymentData.name_first);
            paymentInfo.append('name_last', paymentData.name_last);
            paymentInfo.append('email_address', paymentData.email_address);
            paymentInfo.append('amount', paymentData.amount);
            paymentInfo.append('item_name', paymentData.item_name);
            paymentInfo.append('item_description', paymentData.item_description);
            paymentInfo.append('passphrase', config.passphrase);
            const hash = payfast.createSignature(paymentInfo.toString());
            const paymentObject = await payfast.createPaymentObject(paymentData, hash);
            const paymentUrl = await payfast.generatePaymentUrl(paymentObject);
            await expect(await paymentUrl).toMatch(/^https:\/\/sandbox\.payfast\.co\.za\/eng\/process\/payment\/[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i);
        });
    });
});
