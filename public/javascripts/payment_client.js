var form = document.querySelector('#cardForm');

// Input switcher
var formItems = [];
var currentFormItem = 0;

$('.field-container').each(function() {
  formItems.push(this);
})

// Add the functionality for what happens when people will click on next
function formControlNext() {
  $(formItems[currentFormItem]).addClass('field-container--hidden');
  $(formItems[currentFormItem + 1]).removeClass('field-container--hidden');

  currentFormItem = currentFormItem + 1;
  checkFormVisibility();
  changeStepperNumber();

  hideNext();

  return false;
}

function hideNext() {
  if (!$(formItems[currentFormItem + 1]).find('.hosted-field').hasClass('hosted-field')) {
    $('.form-controls__next').addClass('form-controls--hidden');
  }
  
  $('.form-controls__prev').addClass('form-controls--back');
}

function formControlPrev() {
  $(formItems[currentFormItem]).addClass('field-container--hidden');
  $(formItems[currentFormItem - 1]).removeClass('field-container--hidden');

  currentFormItem = currentFormItem - 1;
  checkFormVisibility();
  changeStepperNumber();
}

function showNext() {
  $('.form-controls__next').removeClass('form-controls--hidden');
  $('.form-controls__prev').removeClass('form-controls--back');
}

$('.form-controls__next').click(function() {
  formControlNext();

  return false;
})

$('.form-controls__prev').click(function() {
  formControlPrev();

  return false;
})

// Update the number of steps and update the content to match input
function changeStepperNumber() {
  if (currentFormItem === 3) {
    $('.form-controls__steps').text('4 / 4');
    //$('.field-message').text('Time to buy that sweet sweet bag.');
    $('.form-controls').addClass('form-controls--end');
  } else if (currentFormItem === 2) {
    $('.form-controls__steps').text('3 / 4');
    $('.field-message').text('This is on the back of your card.');
    $('.form-controls').removeClass('form-controls--end');
  } else if (currentFormItem === 1) {
    $('.form-controls__steps').text('2 / 4');
    $('.field-message').text('When will your card expire?');
  } else {
    $('.form-controls__steps').text('1 / 4');
    $('.field-message').text('Let\'s add your card number.');
  }
}

// Show/hide the appropriate controls
function checkFormVisibility() {
  if (currentFormItem === 0) {
    $('.form-controls__prev').addClass('form-controls--hidden');
  } else {
    $('.form-controls__prev').removeClass('form-controls--hidden');
  }

  if (currentFormItem === 3) {
    $('.form-controls__next').addClass('form-controls--hidden');
  } else {
    $('.form-controls__next').removeClass('form-controls--hidden');
  }
}

// Create Braintree components
braintree.client.create({
  authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
}, function(err, client) {
  if (err) {
    console.error(err);
    return;
  }

  braintree.hostedFields.create({
    client: client,
    styles: {
      'input': {
        'font-size': '2em',
        'font-weight': '300',
        'font-family': 'sans-serif',
        'color': '#fff'
      },
      ':focus': {
        'color': '#fff'
      },
      '.invalid': {
        'color': '#fff'
      },
      '@media screen and (max-width: 361px)': {
        'input': {
          'font-size': '1em'
        }
      }
    },
    fields: {
      number: {
        selector: '#card-number'
      },
      cvv: {
        selector: '#cvv'
      },
      expirationDate: {
        selector: '#expiration-date'
      }
    }
  }, function(err, hostedFields) {
    if (err) {
      console.error(err);
      return;
    }

    hostedFields.on('validityChange', function(event) {
      var field = event.fields[event.emittedBy];

      if (field.isValid) {
        // Show Next button if inputs are valid
        showNext();

        // Update message to reflect success
        $('.field-message').text('Nice! Let\'s move on…');
      } else if (!field.isPotentiallyValid) {
        // Hide next button
        $('.form-controls__next').addClass('form-controls--hidden');
        // Change the top message based on the input error
        switch ($(field.container).attr('id')) {
          case 'card-number':
            $('.field-message').text('Please check if you typed the correct card number.');
            break;
          case 'expiration-date':
            $('.field-message').text('Please check your expiration date.');
            break;
          case 'cvv':
            $('.field-message').text('Please check your security code.');
            break;
        }
      } else {
        switch ($(field.container).attr('id')) {
          case 'card-number':
            $('.field-message').text('Let\'s add your card number.');
            break;
          case 'expiration-date':
            $('.field-message').text('When will your card expire?');
            break;
          case 'cvv':
            $('.field-message').text('This is on the back of your card.');
            break;
        }
      }
    });

    hostedFields.on('focus', function(event) {
      var field = event.fields[event.emittedBy];

      $(field.container).prev('.hosted-field--label').addClass('hosted-field--label--moved');
      $(field.container).parent().addClass('field-container--active');
    });

    hostedFields.on('blur', function(event) {
      var field = event.fields[event.emittedBy];

      $(field.container).prev('.hosted-field--label').removeClass('hosted-field--label--moved');
      $(field.container).parent().removeClass('field-container--active');
    });

    hostedFields.on('empty', function(event) {
      var field = event.fields[event.emittedBy];

      $(field.container).prev('.hosted-field--label').removeClass('not-empty');
    });

    hostedFields.on('notEmpty', function(event) {
      var field = event.fields[event.emittedBy];

      $(field.container).prev('.hosted-field--label').addClass('not-empty');
    });

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      hostedFields.tokenize(function(err, payload) {
        if (err) {
          console.error(err);
          return;
        }

        // This is where you would submit payload.nonce to your server
        alert('Submit your nonce to your server here!' + payload.nonce);
      });
    });
  });
});