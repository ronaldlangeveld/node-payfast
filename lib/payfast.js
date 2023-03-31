const crypto = require('crypto');
const axios = require('axios');

class PayFast {
  constructor(config) {
    this.config = config;
  };

  getApiUrl() {
    const env = this.config.environment;

    if (env !== 'production') {
      return 'https://sandbox.payfast.co.za';
    }
    return 'https://www.payfast.co.za';
  };


  getMerchantId() {
    return this.config.merchant_id;
  }

  getMerchantKey() {
    return this.config.merchant_key;
  }

  getPassPhrase() {
    return this.config.passphrase;
  }

  setEnvironmentConfig(env) {
    this.config.environment = env;
  }

  encodeURIString(string) {
    return encodeURIComponent(string).replace(/%20/g, "+");
  }

  createPaymentObject(data, signature) {
    return {
      merchant_id: this.getMerchantId(),
      merchant_key: this.getMerchantKey(),
      ...data,
      signature: signature
    }
  };

  createStringfromObject(data) {
    const passPhrase = this.getPassPhrase();

    data = {
      merchant_id: this.getMerchantId(),
      merchant_key: this.getMerchantKey(),
      ...data,
    }

    let pfOutput = "";
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== "") {
          const trimmedValue = data[key] && data[key].trim(); // check if data[key] is not null or undefined before calling trim()
          pfOutput += `${key}=${this.encodeURIString(trimmedValue)}&`
        }
      }
    }

    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString += `&passphrase=${this.encodeURIString(passPhrase.trim())}`;
    }

    return getString;

  }

  createSignature(string) {
    return crypto.createHash("md5").update(string).digest("hex");
  }

  async generatePaymentUrl(data) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const url = `eng/process`;
    const fullUrl = `${this.getApiUrl()}/${url}`;
    const request = await axios.post(`${fullUrl}`, {}, { params: data }, { headers: headers }).then((res) => {
      return res;
    }).catch((err) => {
      // console.log(err);
      console.error('Error generating payment URL');
      return;
    });
    return `${this.getApiUrl()}${request.request.socket._httpMessage.path}`;
  }
}

module.exports = { PayFast };
