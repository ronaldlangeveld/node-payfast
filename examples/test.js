import PayFast from "../lib/payfast.js";

const config = {
    environment: "sandbox",
    merchant_id: '',
    merchant_key: '',
    return_url: '',
    cancel_url: '',
    notify_url: '',
    m_payment_id: '',
    amount: '',
    item_name: '',
    item_description: '',
}

const runPayFast = () => {
    const payFast = new PayFast(config);
    const paymentUrl = payFast.getPaymentUrl();
    const paymentFields = payFast.getPaymentFields();

    return {
        paymentUrl,
        paymentFields
    }
}

const pf = runPayFast();

console.log(pf);