import crypto from 'crypto';
import axios from 'axios';

const baseUrl = {
  sandbox: 'https://sandbox.payfast.co.za',
  production: 'https://www.payfast.co.za'
};

class PayFast {
  constructor(config) {
    this.config = config;
  };

  getApiUrl() {
    if (this.config.sandbox) {
      return baseUrl.sandbox;
    } else {
      return baseUrl.production;
    }
  };


  createPaymentObject(data, signature) {
    return {
      merchant_id: this.config.merchant_id,
      merchant_key: this.config.merchant_key,
      ...data,
      signature: signature
    }
  };

  createStringfromObject(data) {
    const passPhrase = this.config.passphrase;

    data = {
      merchant_id: this.config.merchant_id,
      merchant_key: this.config.merchant_key,
      ...data, 
    }

    let pfOutput = "";
    for (let key in data) {
      if(data.hasOwnProperty(key)){
        if (data[key] !== "") {
          pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
        }
      }
    }
  
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }

    return getString;

  }

  createSignature(string) {
    return crypto.createHash("md5").update(string).digest("hex");
  }

  async generatePaymentUrl(data) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const url = `eng/process`;
    const request = await axios.post(`${this.getApiUrl()}/${url}`, {}, {params:data}, {headers:headers}).then((res) => {
      return res;
    }).catch((err) => {
      console.error('Error');
      return;
    });
    return `${this.getApiUrl()}${request.request.socket._httpMessage.path}`;
  }

}

export default PayFast;