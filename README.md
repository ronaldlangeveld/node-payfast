
# 💸 node-payfast
[![CI](https://github.com/ronaldlangeveld/node-payfast/actions/workflows/main.yml/badge.svg)](https://github.com/ronaldlangeveld/node-payfast/actions/workflows/main.yml)

A node library to simplify creating custom integrations with [Payfast](https://payfast.io).
  
## Installation

```npm install node-payfast```

```yarn add node-payfast```

##  Usage

```
// server.js

const {PayFast} = require('node-payfast');

const  config  = {
sandbox: true, // Defaults to false
merchant_id: process.env.MERCHANT_ID,
merchant_key: process.env.MERCHANT_KEY,
passphrase: process.env.PASSPHRASE
}

// Initialize a new Payfast instance with your config data.
const  pf  =  new PayFast(config);

// Very important to keep the order of the parameters as per Payfast's documentation, else it will drive you mad, cause the signature won't validate.
// I know, it's dumb, but that's how it is till Payfast's dev team fixes it.

var  paymentData  = {
return_url: 'https://www.someurl.com/success',
cancel_url: 'https://www.someurl.com/cancel',
notify_url: 'https://www.someurl.com/notify',
name_first: 'John',
name_last: 'Doe',
email_address: 'john@doe.com',
amount: '300.00',
item_name: 'Cheese',
item_description: '1 block of cheese',
// add extra lines for subscriptions, etc.
};

async  function  getPaymentURL() {
// Keep each function seperate as it may have for future features:

const  urlString  =  pf.createStringfromObject(paymentData);
const  hash  =  pf.createSignature(urlString);
const  paymentObject  =  pf.createPaymentObject(paymentData, hash);
const  generatePaymentUrl  =  await  pf.generatePaymentUrl(paymentObject);
return  generatePaymentUrl;
// It will return a URL like https://sandbox.payfast.co.za/eng/process/payment/9d64e7f4-bca2-4db1-a0b8-41f32e905c0d
// Send that URL to your frontend or redirect user to it, or however you wish to use it.
};

```

## Roadmap 🛣

 - [x] Create URL String from payment data
 - [x] Generate Signature
 - [x] Sends request with Payment data and returns Payment page URL (Inspired by Stripe)
 - [ ]  Webhook validation 
 - [ ]  Split Payments
 
 
# Contributing
Contributions are welcome! Here's how you can help:

## Bug Reports and Feature Requests
If you find a bug or want to suggest a new feature, please create an issue on the GitHub repository with a detailed description. Be sure to check if a similar issue or feature request already exists before creating a new one.

## Pull Requests
If you want to contribute code to this project, you can fork the repository, create a new branch, make your changes, and then create a pull request. Please make sure to write clear commit messages and add appropriate tests for your changes.

## Code Reviews
Code reviews are an essential part of the development process. If you're interested in reviewing pull requests, please let us know by leaving a comment on the relevant pull request or by reaching out to one of the maintainers.

## Documentation
Improving the documentation is always appreciated. If you notice any errors or want to suggest improvements, please open an issue or submit a pull request with your changes.
