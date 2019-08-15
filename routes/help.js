//Preliminary Step: Configure the environment and API credentials.
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "h5tc2bn7ts33q5cz",
  publicKey: "4xtvgxht5wyj6wzs",
  privateKey: "6add74d080d900a85613939915b7c9bc"
});

var merchantAccountParams = {
  individual: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@14ladders.com",
    phone: "5553334444",
    dateOfBirth: "1981-11-19",
    ssn: "456-45-4567",
    address: {
      streetAddress: "111 Main St",
      locality: "Chicago",
      region: "IL",
      postalCode: "60622"
    }
  },
  funding: {
    descriptor: "Blue Ladders",
    destination: braintree.MerchantAccount.FundingDestination.Bank,
    email: "funding@blueladders.com",
    mobilePhone: "5555555555",
    accountNumber: "1123581321",
    routingNumber: "071101307"
  },
  tosAccepted: true,
  masterMerchantAccountId: "peersity12345",
  id: ""
};


function createMerchant() {
  gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
    console.log('The result is ' + JSON.stringify(result))
  });
}

/**
  Step One: Your front-end requests(visiting the payment route) a client token from your server and initializes the client SDK.
  Step Two: Your server generates and sends a client token back to your client using the server SDK.
**/
router.get('/', ensureAuthenticated, function(req, res, next) {
  createMerchant()
  gateway.clientToken.generate({}, function (err, response) {
    var clientToken = response.clientToken
    //We package the client token here and allow our front end to use it, when we render the payment page
    res.render('payment', {client_Token: clientToken})
  });
});