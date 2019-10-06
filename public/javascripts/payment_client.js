// Create a Stripe client.
var stripe = Stripe('pk_test_fx9SY4mb7GwIXUbkkHqbfPcw00337G3sMt');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
var button = document.getElementById('sub');
button.addEventListener('click', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      console.log(JSON.stringify(result))
      var URL = 'http://localhost:6969/payment';
      var obj = {
        token: result.token
      }
      $.ajax({
        url: URL,
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function () {
          console.log("AJAX sent correctly")
        },
        error: function () {
          console.log("AJAX sent incorrectly")
        }
      })
    }
  });
});

function minutesToSeconds(minutes) {
  var result = minutes * 60;
  return result;
}

/**
  This function will to turn the amount of minutes to pennies
*/
function minutesToPennies(minutes) {
  var result = minutes * 25;
  return result;
}
/**
  This function will to turn the amount of pennies to dollars
*/
function penniesToDollars(pennies) {
  var result = pennies/100
  return result;
}

//When you click a button with the time, the money will be calculated and will be sent to the server side
$(".button_min").each(function() {
    $(this).click(function(e) {
      // if ($(this).attr('value') == "true") {
      //   $(this).toggleClass('clickedButton', true);
      // }
      e.preventDefault();
      var time_minutes = $(this).attr('name');
      var transaction_price = minutesToPennies(time_minutes)
      console.log("The dollar amount is: $" + penniesToDollars(transaction_price) + " dollars")
      var URL = 'http://localhost:6969/payment/market';
      var obj = {
        time: time_minutes,
        transaction_price: transaction_price //pennies
      }
      $.ajax({
        url: URL,
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function () {
          console.log("AJAX sent correctly from button")
        },
        error: function () {
          console.log("AJAX sent incorrectly from button")
        }
      })
    });
});
