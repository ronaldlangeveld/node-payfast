import 'dotenv/config';
import PayFast from "../lib/payfast.js";

const config = {
    sandbox: true,
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY,
    passphrase: process.env.PASSPHRASE
}

const pf = new PayFast(config);


var paymentData = {
    'return_url': 'http://localhost:3000/success',
    'cancel_url': 'http://localhost:3000/cancel',
    'notify_url': 'http://localhost:3000/notify',
    'name_first': 'John',
    'name_last': 'Doe',
    'email_address': 'name@example.com',
    'm_payment_id': 'some_unique_id',
    'amount': '100.00',
    'item_name': 'Test Transaction',
    'item_description': 'A transaction for testing purposes',
}

async function makePayment() {
    const pfdata = pf.createPaymentObject(paymentData);
    const hash = pf.createSignature(pfdata);
    const url = await pf.generatePaymentUrl(pfdata, hash);
    console.log(url);
    
    
};


makePayment();

