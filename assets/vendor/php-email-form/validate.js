
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      const formData = {}

      formData.name = document.getElementById("name").value;
      formData.email = document.getElementById("email").value;
      formData.subject = document.getElementById("subject").value;
      formData.message = document.getElementById("message").value;

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'sendMessage'})
              .then(token => {
                formData.set('recaptcha-response', token);
                sendMessage(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        sendMessage(thisForm, action, formData);
      }
    });
  });

  function sendMessage(thisForm, action, formData) {
    $.ajax({
          url: action,
          data: formData,
          type: 'POST',
          headers: {'X-Requested-With': 'XMLHttpRequest'}
      })
    .then((data) => {
      console.log(data)
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.code == 'success') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      }else{
        let message = "Failed to send message. Please try again later or send an email directly to mphothedev@gmail.com";
        displayError(thisForm, message);
      }
    }).fail(error=>{

       let message = "Failed to send message. Please try again later or send an email directly to mphothedev@gmail.com";
       displayError(thisForm, message);
    })
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();


