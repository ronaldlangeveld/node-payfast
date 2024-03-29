require('dotenv').config()
const {PayFast} = require('../lib/payfast');

const config = {
    sandbox: true,
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY,
    passphrase: process.env.PASSPHRASE
}

const pf = new PayFast(config);

var paymentData = {
    return_url: 'https://www.ron.com/success',
    cancel_url: 'https://www.ron.com/cancel',
    notify_url: 'https://www.ron.com/notify',
    name_first: 'John',
    name_last: 'Doe',
    email_address: 'john@doe.com',
    amount: '300.00',
    item_name: 'Cheese',
    item_description: '1 block of cheese',
}

async function makePayment() {
    const urlString = pf.createStringfromObject(paymentData);
    const hash = pf.createSignature(urlString);
    const paymentObject = pf.createPaymentObject(paymentData, hash);
    const generatePaymentUrl = await pf.generatePaymentUrl(paymentObject);
    return generatePaymentUrl;
}

const getUrl = async() => {
    const url = await makePayment();
    return url;
}

getUrl();
