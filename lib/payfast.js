'use strict';

class PayFast {
    constructor(config) {
        this.config = config;
    }

    getPaymentUrl() {
        return `https://${this.config.environment}.payfast.co.za/eng/process`;
    }

    getPaymentFields() {
        return {
            merchant_id: this.config.merchant_id,
            merchant_key: this.config.merchant_key,
            return_url: this.config.return_url,
            cancel_url: this.config.cancel_url,
            notify_url: this.config.notify_url,
            m_payment_id: this.config.m_payment_id,
            amount: this.config.amount,
            item_name: this.config.item_name,
            item_description: this.config.item_description,
        }
    }
}

export default PayFast;