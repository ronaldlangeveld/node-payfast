import crypto from 'crypto';
import axios from 'axios';

const baseUrl = {
  sandbox: 'https://sandbox.payfast.co.za',
  production: 'https://www.payfast.co.za'
}

class PayFast {
  constructor(config) {
    this.config = config;
  }

  getApiUrl() {
    if(this.config.sandbox) {
    return baseUrl.sandbox;
    } else {
      return baseUrl.production;
    }
  }

  createPaymentObject(data){
    return {
      merchant_id: this.config.merchant_id,
      merchant_key: this.config.merchant_key,
      ...data
    }
  }

  createSignature(data) {

      let pfOutput = "";
      for (let key in data) {
        if(data.hasOwnProperty(key)){
          if (data[key] !== "") {
            pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
          }
        }
      }
    
      // Remove last ampersand
      let getString = pfOutput.slice(0, -1);
      if (this.config.passphrase !== null) {
        getString +=`&passphrase=${encodeURIComponent(this.config.passphrase.trim()).replace(/%20/g, "+")}`;
      }

      return crypto.createHash("md5").update(getString).digest("hex");
    
  }

 async generatePaymentUrl(data, hash){

    data = {
      ...data,
      signature: hash
    }

    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    const url = `${this.getApiUrl()}/eng/process`;


  }

}

export default PayFast;